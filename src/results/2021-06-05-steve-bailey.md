---toml
name = "Steve Bailey"
run_date = "2021-06-05"
run_duration = "2:09:59"
other_runners = ["Test Mountain", "Fly Crag"]
year = 2021
date = 2021-06-05T00:00:00.000Z
---
I just did this the other day so I figured I’d blog it up. There is a thing called [Git Large File Storage](https://git-lfs.github.com/) (Git LFS). **Here’s the entire point of it:** it keeps large files out of your repo directly. Say you have 500MB of images on your site and they kinda need to be in the repo so you can work with it locally. But that sucks because someone cloning the repo needs to download a ton of data. Git LFS is the answer.

Netlify has a product *on top* of Git LFS called [Large Media](https://www.netlify.com/docs/large-media/). **Here’s the entire point of it:** In addition to making it all easier to set up and providing a place to *put* those large files, once you have your files in there, you can [URL query param based resizing](https://www.netlify.com/docs/image-transformation/) on them, which is very useful. I’m all about letting computers do my image sizing for me.

You should probably just [read the docs](https://www.netlify.com/docs/large-media/) if you’re getting started with this. But I ran into a few snags so I’m jotting them down here in case this ends up useful.