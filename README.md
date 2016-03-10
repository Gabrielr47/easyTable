![easyTable is a simple plugin for jQuery.](http://s28.postimg.org/cey2iq4a5/easy_Table_fw.png)

<h2>
<a name="Features" class="anchor" href="#features"><span class="mini-icon mini-icon-link"></span></a>Features</h2>
* Sort asc - desc
* Filter by Numbers and Text
* Select all/clear
* Select using shift arrow up or arrow down
* Select using crtl + click
* Fixed header with scroll
* Easy disable and customize methods
* Get the values of selected columns
* Mobile First
* Cross-browser: IE 8.0+, FF 3+, Safari 2.0+, Opera 9.0+, Chrome 5.0+.
* Supports Bootstrap v2 and 3.
* Supports Font Awesome.
* Small code size, just 4KB minified.

<h2>
<a name="installation" class="anchor" href="#installation"><span class="mini-icon mini-icon-link"></span></a>Installation</h2>

<p>Include script <em>after</em> the jQuery library:</p>

<pre><code>&lt;script src="easyTable.js"&gt;&lt;/script&gt;
</code></pre>


<h2>
<a name="usage" class="anchor" href="#usage"><span class="mini-icon mini-icon-link"></span></a>Usage</h2>

<p>After fill the table with data:</p>

```javascript
$("#table").easyTable();
```
<p>To disable some configuration or customize you can set the params like this:</p>
```javascript
$("#table").easyTable({
    hover:'btn-primary',
    buttons:false,
    select:false,
    sortable:true,
    scroll: {active: true, height: '400px'}
});
```
<p> To get the values of columns selected just call the method getSelected() like this:</p>
```javascript
var table = $("#table").easyTable();
$("#getSelected").click(function() {
  table.getSelected(0); // Where the 0 is the index of column, in this example the id column.
});
```
<h2>
<a name="demo" class="anchor" href="#demo"><span class="mini-icon mini-icon-link"></span></a>Demo</h2>
<p><strong><a href="http://gabrielr47.github.io/plugin/">easyTable Site</a></strong> </p>
<p><strong><a href="https://jsfiddle.net/filadown/cbsh4wf6/34/">easyTable Jsfiddle</a></strong> </p>
<h2>
<a name="authors" class="anchor" href="#authors"><span class="mini-icon mini-icon-link"></span></a>Authors</h2>

<p><a href="http://pt.stackoverflow.com/users/17658/gabriel-rodrigues" target="_blank">Gabriel Rodrigues</a></p>
<p><a href="http://pt.stackoverflow.com/users/41757/gabriel-leite" target="_blank">Gabriel Leite</a></p></article>

