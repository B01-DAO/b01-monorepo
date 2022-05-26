# Model SSR

This repo allows you to both view B01 in a browser and to run it server-side and generate a GLTF, screenshots, and a spinning webm.

## Browser

Just run `pnpm dev`, then pop open a browser to `localhost:3001` and you're good to go!

## Server

This is a _bit_ trickier. Just make sure that you have [ffmpeg](https://ffmpeg.org/download.html)
installed and working, then run `pnpm generate` and make sure the window that opens stays visible
for the entire rendering duration. If you have trouble with that, you can use something like
[Xvfb](https://www.x.org/releases/X11R7.6/doc/man/man1/Xvfb.1.xhtml) for Linux or to use [Xquartz](https://www.xquartz.org/)
on Mac to get access to Xvfb. In general, it should be no issue, but if you have Xvfb working, the magic
command is

```bash
xvfb-run pnpm generate
```

After running the generate command, there should be an `out.gltf`, 1800 screenshots and an `output.webm` in the `out` directory!

### Using a specific seed
Adding arguments to the middle of an NPM script sucks =(

So, to defeat this, you'll have to run the full command without using an npm script to generate:

```bash
pnpm start SEED && ffmpeg -y -framerate 60 -i out/%04d.png out/output.webm
```

(Be sure to replace SEED with the seed you'd like to use!)

# What is pnpm?
It's a better npm! =D `npm i -g pnpm`
