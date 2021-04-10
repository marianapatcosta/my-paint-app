# My Paint App

This project is a very simple web/desktop application to mimic some functionalities of the well known _Paint_ application. It was developed using Canvas API with Vue3 and SCSS; electron to build the desktop app version.
My paint app can be accessed at [My Paint App](https://marianapatcosta.github.io/my-paint-app/)

## Main features

#### Shape picker

There are 9 draw options/shapes available: `free draw`, `straight lines`, `rectangles`, `circles`, `ellipsis`, `triangles`, `eraser`, `text` and `image`.

Select and option and draw it on canvas. The draw will be done at the canvas's point you select and, on mouse move, you determine the size of straight lines, rectangles, circles, ellipsis, triangles and images.
For text draw, font family and font size are customizable and can also apply _italic_ and **bold**. Using text draw, unicode emojis can also be drawn in canvas.

By default, all the shapes are drawn with `stroke` without fill, but the `fill` option can be selected and fill can applied in rectangles, circles, ellipsis, triangles, and text shapes.

#### Color picker

A simple color pallete is available by default but any color can be used in this app, due to `personalize` option that allow to pick any color.

The user can select a color for the stroke (the color picked when `stroke` option is selected) and for the fill (the color picked when `fill` option is selected).
If `fill`option is selected, the shapes will be drawn will the color for selected the fill with a border with the color selected for the stroke (applicable for rectangles, circles, ellipsis, triangles, and text).

#### Thickness picker

5 thickness sizes to be applied as shape strokes or brush (in case of free draw, straight lines or eraser).

#### Resize

The canvas size is optimized for different screen sizes (mobile not included). However, canvas `width`and `height` is fully customizable. By clicking on `resize` button, these dimensions can be inserted and canvas automatically adopts them.

#### Reset canvas

The draw produced in this app can be deleted. `Clear` button, resets the canvas, so the draw can be restarted.

#### Save draw

The draw produced in this app can be saved as a .png file. By clicking on `save` a prompt appear so the file name can be assigned.

## Future improvements

- Create a stack history, so `undo`and `redo` functionalities can be implemented;

- Add option to resize, rotate, drag and copy each element drawn in the canvas.

## Project setup

```

yarn install

```

### Compiles and hot-reloads for development

```

yarn serve

```

### Compiles and minifies for production

```

yarn build

```

### Compiles and hot-reloads desktop app for development

```

yarn electron:serve

```

### Builds desktop app for the current OS

```

yarn electron:build

```

### Lints and fixes files

```

yarn lint

```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

```

```
