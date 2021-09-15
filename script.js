var defaultColors = ['rgb(0, 0, 0)',
    'rgb(157, 157, 157)',
    'rgb(255, 255, 255)',
    'rgb(190, 38, 51)',
    'rgb(224, 111, 139)',
    'rgb(73, 60, 43)',
    'rgb(164, 100, 34)',
    'rgb(235, 137, 49)',
    'rgb(247, 226, 107)',
    'rgb(47, 72, 78)',
    'rgb(68, 137, 26)',
    'rgb(163, 206, 39)',
    'rgb(27, 38, 50)',
    'rgb(0, 87, 132)',
    'rgb(49, 162, 242)',
    'rgb(178, 220, 239)']

function main() {
    const palette   = new Palette(defaultColors);
    const grid      = new Grid(50, 50, 10, palette);

    // document.querySelectorAll('.c-palette').forEach(e => e.remove());
    document.querySelector('.c-palette-wrapper').append(palette.domElement);

    // document.querySelectorAll('.c-grid-wrapper').forEach(e => e.remove());
    document.querySelector('.c-canvas').append(grid.domElement);
}

function redrawCanvas(blockSize) {
    document.querySelectorAll('.c-grid-wrapper').forEach(e => e.remove());

    var rows = parseInt(document.querySelectorAll('.c-rows-input')[0].value);
    var cols = parseInt(document.querySelectorAll('.c-cols-input')[0].value);

    const grid = new Grid(rows, cols, blockSize, defaultColors);
    document.querySelector('.c-canvas').append(grid.domElement);
}

function toggleGrid() {
    var gridBlocks = document.querySelectorAll('.c-grid-wrapper__block');
    gridBlocks.forEach(e => {
        e.classList.contains('no--grid') ? e.classList.remove('no--grid') : e.classList.add('no--grid');
    });
}

function clearCanvas() {
    var gridBlocks = document.querySelectorAll('.c-grid-wrapper__block');
    gridBlocks.forEach(e => e.style.backgroundColor = '#fff');
}

class Palette {
    constructor (colorList) {
        this.domElement = this.setPalette(colorList);
        this.activeColor = colorList[0];
    }

    setPalette = (colorList) => {
        var domElement = document.createElement('div');
        domElement.classList.add('c-palette');

        for (var i = 0; i < colorList.length; i++) {
            var swatch = new Swatch(colorList[i], this).domElement;
            if (i == 0) {
                swatch.classList.add('active');
                this.activeColor = 'red';
            }
            domElement.append(swatch);
        }

        return domElement;
    }
}

class Swatch {
    constructor (color, palette) {
        this.color = color;
        this.domElement = this.initializeDomElement(color, palette);
    }

    initializeDomElement = (color, palette) => {
        var domElement = document.createElement('div');
        domElement.classList.add('c-palette__swatch');

        domElement.style.backgroundColor = color;

        domElement.addEventListener('click', () => {
            this.changeActiveColor(palette);

            // Remove the active styling from the active swatch
            document.querySelectorAll('.c-palette__swatch').forEach(e => e.classList.remove('active'));
            // Add active styling to newly activated swatch
            domElement.classList.add('active');
        });

        return domElement;
    }

    changeActiveColor = (palette) => {
        palette.activeColor = this.color;
    }
}

class Grid {
    constructor(rows, cols, blockSize, palette) {
        this.rows   = new Array(rows);
        this.cols   = new Array(cols);

        this.domElement = this.initializeDomElement(blockSize, palette);

        this.palette = palette;

        this.isDrawing = false;
    }

    initializeDomElement = (blockSize, palette) => {
        var domElement = document.createElement('div');
        domElement.classList.add('c-grid-wrapper');
        
        for (var row = 0; row < this.rows.length; row++) {
            for (var col = 0; col < this.cols.length; col++) {
                domElement.append(new GridBlock(blockSize, palette).domElement);
            }
            domElement.style.gridTemplateColumns = domElement.style.gridTemplateColumns.toString() + ' ' + blockSize + 'px';
        }

        return domElement;
    }

    getWidth    = () => { return this.rows.length;  }
    getHeight   = () => { return this.cols.length;  }

    setWidth    = (width)   => { return this.rows = new Array(width);   }
    setHeight   = (height)  => { return this.cols = new Array(height);  }
}

class GridBlock {
    constructor(size, palette) {
        this.size = size;
        this.domElement = this.initializeDomElement(size);
        this.palette = palette;
    }

    initializeDomElement = (size) => {
        var domElement = document.createElement('div');
        domElement.classList.add('c-grid-wrapper__block');

        domElement.style.width = size + 'px';
        domElement.style.height = size + 'px';

        this.setListeners(domElement);

        return domElement;
    }

    setListeners = (domElement) => {
        domElement.addEventListener('click', () => {
            this.changeColor();
        });

        domElement.addEventListener('mousedown', () => {
            this.palette.isDrawing = true;
        });

        domElement.addEventListener('mousemove', () => {
            if (this.palette.isDrawing) {
                this.changeColor();
            }
        });

        domElement.addEventListener('mouseup', () => {
            this.palette.isDrawing = false;
        });
    }

    changeColor = () => {
        this.domElement.style.backgroundColor = this.palette.activeColor;
    }

    getSize = () => { return this.size; }
}