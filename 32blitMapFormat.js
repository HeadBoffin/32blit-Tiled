/*

32blit friendly Tiled export formats

Makes some assumptions about the layers you have setup in your map - read the docs


v0.1	12-Feb-2020	Nick McCloud	Just getting the party started
v0.2	17-Feb-2020	Nick McCloud	Renamed array for tile output, fixed silly error in data output loop

*/



/*

Exports the tile id's from the SINGLE tile set you have used 
Provides the array that can be used by the TileMap functions to draw the map/world/terrain

*/

var ThirtyTwoTilesTxtFormat = {
    name: "32blit tiles",
    extension: "32Tiles",

    write: function(map, fileName) {
        var output = "static const uint8_t terrainTiles[] = {\n";

		var layer = map.layerAt(0);		// VERY BAD - assumes your map is on layer id 0

		// This loop outputs the top line of a numbered grid so you can edit your map
		// without having to come back to Tiled for single simple adjustments
		output += "\n//\t   0";
		for (x = 1; x < layer.width; x++)
			output += " " + decPadded(x, -4);
		output += "\n\n";
		
		// This loop outputs the tile id's plus a row number at the end
		for (y = 0; y < layer.height; y++) {
			output += "\t" + decPadded(layer.cellAt(0, y).tileId, -4);		// Do first entry (x=0)
			for (x = 1; x < layer.width; x++)								// Loop for x = 1 onwards
				output += "," + decPadded(layer.cellAt(x, y).tileId, -4);
			output += ",\t//" + decPadded(y, -3) + "\n";
		}
		
		// Close things off
		output += "};\n";  //output.substring(0, output.length-1) + "\n};";
		
		// And save to disk
        var file = new TextFile(fileName, TextFile.WriteOnly);
        file.write(output);
        file.commit();
    }
}

tiled.registerMapFormat("32Tiles", ThirtyTwoTilesTxtFormat);


/*

Exports the data from the SINGLE tile set you have used 
Last three bit positions are the transformation of the tile - rotation, reflection etc
The other five bit positions are from layer 0, attributes, that allow you to put some
information in the data that you can refer to in game - like is the ground solid, or a 
ladder or water etc

Tiled uses different bit combos than the 32blit, so some remapping has to be done, you can
read all about it after the code if you need a sleep aid.

Jon may come up with a scheme for using boolean algebra to do this at some point.

The format looks a bit intense, but actually splits each entry in to the tiles attribute
and then in to its transform - which again, allows you to edit it by hand if need be

*/


var ThirtyTwoDataTxtFormat = {
    name: "32blit data",
    extension: "32Data",

    write: function(map, fileName) {
        var output = "static const uint8_t terrainData[] = {\n";

		var layer0 = map.layerAt(0);	// Tile transform
		var layer1 = map.layerAt(1);	// Tile attributes
		var height = layer0.height;
		var width  = layer0.width;

		// Output a header line
		output += "\n//\t            " + decPadded(0, -2);
		for (x = 1; x < width; x++)
			output += "              " + decPadded(x, -2);
		output += "\n\n";

		// Combine data for tile map & attributes layers and output
		for (y = 0; y < height; y++) {
			output += "\t(" + shift3(layer1.cellAt(0, y).tileId) + " << 3) + " + decPadded(remapTransform(layer0.flagsAt(0, y)), -1);
			for (x = 1; x < width; x++)
				output += ", (" + shift3(layer1.cellAt(x, y).tileId) + " << 3) + " + decPadded(remapTransform(layer0.flagsAt(x, y)), -1);
			output += ",\t//" + decPadded(y, -3) + "\n";
		}
		
		output += "};\n"; // output.substring(0, output.length-2) + "\n};";
		
        var file = new TextFile(fileName, TextFile.WriteOnly);
        file.write(output);
        file.commit();
    }
}


tiled.registerMapFormat("32Data", ThirtyTwoDataTxtFormat);


// Helper functions

function decToHex(dec) {
	var t = "0" + dec.toString(16);
	return "0x" + t.substr(-2);
}

function decPadded(dec, by) {
	var t = "   " + dec;
	return t.substr(by);
}

function shift3(dec) {
	var t = "  " + dec;
	if (dec == -1) {
		return "  0"
	} else {
		return t.substr(-3);
	}
}


// Tile transforms lookup from Tiled to 32blit

function remapTransform(trans) {
	switch (trans) {
	  case 0:
		return 0;
		break;
	  case 1:
		return 4;
		break;
	  case 2:
		return 2;
		break;
	  case 3:
		return 6;
		break;
	  case 4:
		return 1;
		break;
	  case 5:
		return 5;
		break;
	  case 6:
		return 3;
		break;
	  case 7:
		return 7;		
	}
}

/*

Tile flipping in Tiled, from the documentation:

The highest three bits of the gid store the flipped states. 
Bit 32 is used for storing whether the tile is horizontally flipped, 
bit 31 is used for the vertically flipped tiles 
and bit 30 indicates whether the tile is flipped (anti) diagonally, enabling tile rotation. 
These bits have to be read and cleared before you can find out which tileset a tile belongs to.

H	V	F
0	0	0	=	0
0	0	1	=	1
0	1	0	=	2
0	1	1	=	3
1	0	0	=	4
1	0	1	=	5
1	1	0	=	6
1	1	1	=	7


When rendering a tile, the order of operation matters. 
The diagonal flip (x/y axis swap) is done first, followed by the horizontal and vertical flips.

https://doc.mapeditor.org/en/stable/reference/tmx-map-format/#tile-flipping


And from the 32blit source code:

All sprite mirroring and rotations (90/180/270) can be composed
of simple horizontal/vertical flips and x/y coordinate swaps.

The bits set represent the transforms required to achieve the
end result. Operations are performed (if needed) in the following 
order: horizontal flip -> vertical flip -> x/y swap

For example a 90 degree rotation needs a vertical flip
followed by an x/y coordinate swap.

enum sprite_transform {
	NONE = 0b000,
	HORIZONTAL = 0b001,
	VERTICAL = 0b010,
	XYSWAP = 0b100,
	R90 = 0b101,
	R180 = 0b011,
	R270 = 0b110
};

*/
