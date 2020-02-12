# 32blit-Tiled
##  32blit friendly export format for Tiled

## STATUS ALERT
If you aren't beta-ering (is that a word?) on the 32blit, you're right in the middle of swamp central and the alligators are queuing for you. You'll be needing to be down with them 32bliters for this to make sense.

Good news: Once I've got a clean basic template working, I can provide an example of map creation, putting it in to the code and you'll be golden.

## What is this anyway?

Between Tiled, a cross platform world / map editor and this script, you'll have a cool tool for creating maps for the 32blit.

First, you'll need a copy of Tiled:
[https://www.mapeditor.org](https://www.mapeditor.org)

Then you'll need to put the 32blitMapFormat.js in to Tiled's extension folder, as per instructions here:
[https://doc.mapeditor.org/en/stable/reference/scripting/#script-extensions](https://doc.mapeditor.org/en/stable/reference/scripting/#script-extensions)

There is a starter file for a map:

* **32by16Starter.tmx**

Plus tilemap definition files for the 32blit supplied tile sets that cover a range of potential games straight out the box:

* **Dingbads** - a variety of different tiles
* **Pirate Characters** - walking, running, jumping and more
* **Pirate Tilemap** - the background and all important ship of the high C++
* **Platformer** - the darkest set of tiles with slime & bats & robots
* **Space Shooter Backdrop** - Skulls, mountains & blue fluffy clouds
* **Space Shooter Ships** - a huge nerf gun, a pig nosed ship and more
* **Top Down Shooter** - can you kill the crawling green joystick of doom

Tiled will need you to locate the .png file that you will have got from GitHub:

[https://github.com/pimoroni/32blit-beta/tree/master/assets](https://github.com/pimoroni/32blit-beta/tree/master/assets)

so it can link up with it's tsx file - if you put the PNG's in the same folder as the TSX files, you shouldn't even need to do that.


## Very Naughty Programming ahead

To get the show on the road, the template has three layers which are referenced in the export script by id:

**Map** - the background map, grass, sand, water, cliffs etc

**Attributes** - using the Attributes tileset, you can overlay an id that you can lookup in your program to decide what sort of tile your hero is standing on - be it solid ground, water, a hole, fire, gold and some letters for your own requirements

**Objects** - you can add sprites here for items or areas that do special things that are coded in your program - NOT EXPORTED YET

Start with the template, it will work.

## Exporting your creativity

Having got to grips with Tiled, you will want to output your masterpiece to use on your 32blit project.

From the File menu, Export As ... and then choose:

* 32blit Tiles - for your map/world
* 32blit Data - for your combined transformations & attributes

These are likely headed for a .hpp file, but you know this, don't you Obi Wan Blitter?

## Merging tilesets

Create a new map 16 x 16 (nothing more, nothing less), put your tiles of choice on to this map, just one of each mind, Export as Image and then make a new Tileset with that image. Again, more instructions on this soon. 

## What next
As above, I'll get my game template finished and then we can link the two together to get everyone on the path to 32blit righteousness.

Feel free to pull, push, tug or take issue with this, but just so you know, this ain't my day time job, so hold on to your hats and I'll look at what's up as & when.