var sample = {

    // react to color change
    colorChange : function(sel)
    {
        var style = document.getElementById('colorStyle');
        style.href = '../src/ui.' + sel.value + '-theme.css';
    },
    
    
    // autoload : write color selection
    writeColorSelection : function()
    {
        var sel = document.getElementById('colorSelect');
        sel.options[0] = new Option('yellow');
        sel.options[1] = new Option('blue');
        sel.options[2] = new Option('dark');
    },
    
    
    // set theme
    darkTheme : function(sel)
    {
        if ( sel.value == '1' )
        {
            document.body.style.backgroundColor = '#040e23';
            document.body.style.color = 'white';
        }
        else
        {
            document.body.style.backgroundColor = 'white';
            document.body.style.color = 'black';
        }
    },
    

    // output
    output: function(lib)
    {
        document.getElementById('output').innerHTML = lib;
    }
    
};



// autoload
nettools.jscore.registerOnLoadCallback(sample.writeColorSelection);
