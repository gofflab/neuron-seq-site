<<<<<<< HEAD
# Demo Site

## Setting up an Environment

### pyenv

Install pyenv by following instructions at https://github.com/yyuu/pyenv#installation

### Clone this repo

```
git clone https://github.com/gofflab/neuron-seq-site
```

### Install dependencies

Navigate to the code:

```
cd neuron-seq-site
```

Using pyenv, we can safely install a complete development environment. First we
use pyenv to install the version of python we are using. Then, we use pip to
install the libraries we depend on:

```
pyenv install
pip install -r requirements.txt
```

## Running

To run the server on port 8000:

```
python manage.py runserver 0.0.0.0:8000
```
=======
# Welcome to SlickGrid

Find documentation and examples in [the wiki](https://github.com/mleibman/SlickGrid/wiki).

## SlickGrid is an advanced JavaScript grid/spreadsheet component

Some highlights:

* Adaptive virtual scrolling (handle hundreds of thousands of rows with extreme responsiveness)
* Extremely fast rendering speed
* Supports jQuery UI Themes
* Background post-rendering for richer cells
* Configurable & customizable
* Full keyboard navigation
* Column resize/reorder/show/hide
* Column autosizing & force-fit
* Pluggable cell formatters & editors
* Support for editing and creating new rows.
* Grouping, filtering, custom aggregators, and more!
* Advanced detached & multi-field editors with undo/redo support.
* “GlobalEditorLock” to manage concurrent edits in cases where multiple Views on a page can edit the same data.
* Support for [millions of rows](http://stackoverflow.com/a/2569488/1269037)
>>>>>>> 33e75b07bfd769349525dc084d987c406fc03e24
