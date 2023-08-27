// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name default.js
// @language_out ECMASCRIPT_2017
// ==/ClosureCompiler==


window.nettools = window.nettools || {};
nettools.ui = nettools.ui || {};
nettools.ui.desktop = nettools.ui.desktop || {};








/** INPUT HELPER **/
nettools.ui.desktop.InputHelper = (function(){
    
	// ---- DECL. PRIVEES ----
	
    /**
	 * Event handler detecting TAB keypress on textarea
	 *
	 * @param strint tab String to use as tab spaces
	 * @param Event e
	 */
    function _textAreaOnKeyDownTabBehavior(tab, e)
    {
        // default is 4 spaces
        var tab = tab || '    ';

        // 'tab' key pressed ?
        if ( (e || window.event).keyCode == 9 )
        {
            // if shift + tab, we want to remove spaces BEFORE cursor
            if ( (e||window.event).shiftKey )
            {
                // get current selection
                var selection = this.value.substring(this.selectionStart, this.selectionEnd);


                // if selection exists, maybe over several paragraphs
                if ( this.selectionStart != this.selectionEnd )
                {
                    // grow selection at begin/end to select whole first and last paragraphs
                    nettools.ui.desktop.InputHelper.textareaSelectParagraph(this);

                    // compute selection again
                    var beforeSelection = this.value.substring(0, this.selectionStart);
                    var afterSelection = this.value.substring(this.selectionEnd);
                    var selection = this.value.substring(this.selectionStart, this.selectionEnd);

                    // remove spaces after new lines and spaces at paragraph begin
                    selection = selection.replace(new RegExp('\n' + tab, 'g'), '\n').replace(new RegExp('^' + tab, 'g'), '');

                    // update content
                    this.value = beforeSelection + selection + afterSelection;

                    // set selection
                    this.setSelectionRange(beforeSelection.length, beforeSelection.length + selection.length);									

                    // call onchange event
                    if ( typeof this.onchange === 'function' )
                        this.onchange();
                }


                // if no selection
                else
                    // if we have enough spaces before cursor
                    if ( this.value.substr(this.selectionStart - tab.length, tab.length) == tab )
                    {
                        // compute new selection
                        var beforeSelection = this.value.substring(0, this.selectionStart - tab.length);
                        var selection = this.value.substring(this.selectionStart, this.selectionEnd);
                        var afterSelection = this.value.substring(this.selectionEnd);

                        // update content
                        this.value = beforeSelection + selection + afterSelection;

                        // set selection
                        this.setSelectionRange(beforeSelection.length, beforeSelection.length + selection.length);									

                        // call onchange event
                        if ( typeof this.onchange === 'function' )
                            this.onchange();
                    }
            }


            // if TAB key alone (no shift)
            else 
            {
                // get current selection
                var selection = this.value.substring(this.selectionStart, this.selectionEnd);


                // if selection exists
                if ( this.selectionStart != this.selectionEnd )
                {
                    // select whole paragraph
                    nettools.ui.desktop.InputHelper.textareaSelectParagraph(this);

                    // compute selection again
                    var beforeSelection = this.value.substring(0, this.selectionStart);
                    var afterSelection = this.value.substring(this.selectionEnd);
                    var selection = this.value.substring(this.selectionStart, this.selectionEnd);

                    // update selection, inserting a space before and then at each new line
                    selection = tab + selection.replace(/\n/g, '\n' + tab);

                    // update content
                    this.value = beforeSelection + selection + afterSelection;

                    // updating selection
                    this.setSelectionRange(beforeSelection.length, beforeSelection.length + selection.length);									

                    // call onchange event
                    if ( typeof this.onchange === 'function' )
                        this.onchange();
                }


                // if no selection
                else 
                {
					// compute selection
                    var beforeSelection = this.value.substring(0, this.selectionStart);
                    var afterSelection = this.value.substring(this.selectionEnd);
                    var selection = this.value.substring(this.selectionStart, this.selectionEnd);

                    // insert tab before selection
                    this.value = beforeSelection + tab + selection + afterSelection;

                    // updating selection range
                    this.setSelectionRange(beforeSelection.length + tab.length, beforeSelection.length + tab.length + selection.length);

                    // call onchange event
                    if ( typeof this.onchange === 'function' )
                        this.onchange();
                }
            }


            // focus
            this.focus();


            // prevent default behavior for TAB key (exiting field)
			e.preventDefault();
            return false;
        }

        else
            return true;	// not handled
    }

    
    
    // NoCopyPasteBehavior event handler
    function _inputOnKeyDownNoCopyPasteBehavior(e)
    {
        // keys V, v, c, C pressed ?
        var kc = (e || window.event).keyCode;
        if ( (e||window.event).ctrlKey && ((kc == 118) || (kc == 86) || (kc == 67) || (kc == 99)) ) 
            return false;
        else
            return true;
    }
    
	// ---- /PRIVATE ---
	
	return {
		
		/**
         * Inside textarea, select whole paragraph
         *
         * @param HTMLTextAreaElement Textarea field 
         * @param bool focusAfter True if we want to set focus on the field after selection
         */
		textareaSelectParagraph : function(textarea, focusAfter)
		{
			// if selection is not at a line begin, go backward to the line begin
			var beforeSelection = textarea.value.substring(0, textarea.selectionStart);
			if ( textarea.value.substr(textarea.selectionStart - 1, 1) != '\n' )
				// by updating selection
				textarea.setSelectionRange(beforeSelection.lastIndexOf('\n') + 1, textarea.selectionEnd);
				

			// if selection end is not at a line end, go toward the line end
			var afterSelection = textarea.value.substring(textarea.selectionEnd);
			if ( textarea.value.substr(textarea.selectionEnd, 1) != '\n' )
			{
				// look for next paragraph marker
				var pos = afterSelection.indexOf('\n');
				if ( pos != -1 )
					// update selection end to be at a line end
					textarea.setSelectionRange(textarea.selectionStart, textarea.selectionEnd + pos);
				
				else
					// otherwise, selecting everything to the textarea end
					textarea.setSelectionRange(textarea.selectionStart, textarea.selectionEnd + afterSelection.length);
			}
            
			
			// focus required ?
            if ( focusAfter )
                textarea.focus();
		},
		
		
        
		/**
         * Add a TAB/SHIFT+TAB behavior (indent) to a textarea
         *
         * @param HTMLTextAreaElement textarea input
         * @param string tab Charater to use for padding
         */
		textareaTabBehavior : function(textarea, tab)
		{
			nettools.ui.desktop.InputHelper.inputAddKeyBehavior(textarea, _textAreaOnKeyDownTabBehavior.bind(textarea, tab));
		},
		
        
		
		/**
         * Forbid copy/paste inside input
         *
         * @param HTMLInputElement input
         */
		inputNoCopyPasteBehavior : function(input)
		{
			nettools.ui.desktop.InputHelper.inputAddKeyBehavior(input, _inputOnKeyDownNoCopyPasteBehavior);
		},
		
        
		
		/**
         * Add a specifc behavior to an input
         * 
         * @param HTMLInputElement input
         * @param function(Event) cb onkeydown event handler ; an event chain is used, returning FALSE halts event handling among all registered event handlers
         */
		inputAddKeyBehavior : function(input, cb)
		{
			nettools.jscore.addEvent(input, 'onkeydown', cb);
		}
		
    };
    
})();








// ==== TABS ====

nettools.ui.desktop.Tabs = class {
	
	/** 
	 * Tabs constructor.
	 *
	 * `params` can have the following keys and values :
	 *   - outputTo : HTMLElement ; the DOM node the tabs will be rendered into
	 *   - orientation : string ; may be set to 'P' (portrait) or 'L' (landscape)
	 *   - tabs : object[] ; array of object litterals describing tabs with `title`, `id` and `url` properties
	 *   - csrf : bool ; are URL in `tabs` property secured by CSRF values ?
	 *   - portraitTabWidth : string ; width of tabs when Portrait mode (one tab per line), must be defined with unit, ex. '150px' ; default '120px'
	 *   - id : string ; tabs group id name, if not set the ID is taken from the id of the container the tabs are added into
	 *
	 * @param object params Object litteral with tabs parameters
	 */
	constructor(params)
	{
		this.params = params;
	}

	

    /**
     * Display tabs inside a node
     *
     * @param null|HTMLElement container HTML tag where tabs will be rendered ; if not set, the value is looked for into `params` constructor argument
     */
    output(container)
    {
		if ( container )
        	this.params.outputTo = container;
		else
			container = this.params.outputTo;


        // parameters normalize
        this.params.orientation = this.params.orientation || 'P';
        this.params.tabs = this.params.tabs || [];
        this.params.csrf = this.params.csrf || false;
		this.params.id = this.params.id || container.id;

        if( this.params.orientation == 'P' )
            this.params.portraitTabWidth = this.params.portraitTabWidth || '120px';

		
        // apply CSS style, portrait or landscape
        var css = 'uiTabs' + this.params.orientation;

		
        // top container styling
        container.classList.add(css + 'Flex');

        
        var ul = document.createElement('ul');
        ul.className = css;
        if ( this.params.orientation == 'P' )
            ul.style.width = this.params.portraitTabWidth;

		
        // handle tab click
        var that = this;
        var onclick = function(e){ that.selectTab(this); return false; };

		
        // display all tabs
        for ( var i = 0 ; i < this.params.tabs.length ; i++ )
        {
            // define tab ID
            this.params.tabs[i].id = this.params.tabs[i].id || this.params.tabs[i].title;
            
            var li = document.createElement('li');
            li.id = this.params.id + '_' + this.params.tabs[i].id;
            li.innerHTML = this.params.tabs[i].title;
            li.onclick = onclick;
            ul.appendChild(li);
        }
        
        
        // add tabs to container
        container.appendChild(ul);
        
        
        // create top container for opened tab content
        var div = document.createElement('div');
        div.id = this.params.id + 'Content';
        div.className = 'uiTabs' + this.params.orientation + 'Content';
        
        
        // for all tabs, create container and iframe
        for ( var i = 0 ; i < this.params.tabs.length ; i++ )
        {
            var tab = document.createElement('div');
            tab.id = this.params.id + '_' + this.params.tabs[i].id + 'Content';
            tab.style.visibility = 'hidden';
            tab.style.display = 'none';
            
            var iframe = document.createElement('iframe');
            iframe.src = this.params.csrf ? nettools.jscore.SecureRequestHelper.addCSRFHashedValue(this.params.tabs[i].url) : this.params.tabs[i].url;
            iframe.frameBorder = 0;
            iframe.marginHeight = 0;
            iframe.marginWidth = 0;
            iframe.style.width = '100%';
            iframe.style.height = '100%';

            tab.appendChild(iframe);
            div.appendChild(tab);
        }
        
        // top container added to tabs right or bottom container
        container.appendChild(div);
        
        
        // after output, initialize GUI
        this.init();
    }
	
	
	
	/**
	 * Tabs init after output
	 */
	init()
	{
		var ul = this.params.outputTo.querySelector('ul');

		// set first tab as selected/current
		ul.firstChild.className = "uiTabSelected";

		// store current selected tab
		ul.setAttribute('data-selected', ul.firstChild.id);

		// set content container for first tab visible
		var tab = document.getElementById(ul.firstChild.id + "Content");
		tab.style.visibility = "visible";
		tab.style.display = "block";
	}
	
	
	
    /**
     * Select a tab
     * 
     * @param string|HTMLLIElement tab id of tab to select or HTMLLIElement (used internally for onclick events on tabs)
     * @return Node Renvoie le container de l'onglet
     */
    selectTab(tab)
    {
        if ( typeof tab == 'string' )
            // create full tab id, with params.id + tab.id
            var target = document.getElementById(this.params.id + '_' + tab);
        else
            var target = tab;
		
        
        if ( !target )
            return;

        
		// get UL (tabs container) node
		var ul = target.parentNode;
		var tab;
		
		
		// if target tab not selected
		if ( target.className === "" )
		{
			// look for old selected tab and remove style and hide its content
			if ( tab = ul.getAttribute('data-selected') )
			{
				document.getElementById(tab).className = "";
				var tabc = document.getElementById(tab + "Content");
				tabc.style.visibility = "hidden";
				tabc.style.display = "none";
			}
			
			// set tab in argument as current one
			target.className = "uiTabSelected";		
			ul.setAttribute('data-selected', target.id);
		}

		
		// show tab content
		tab = document.getElementById(target.id + "Content");
		tab.style.visibility = "visible";
		tab.style.display = "block";
    }    
    
	
	
	 /**
	 * Get selected tab ID
	 *
	 * @return string
	 */
	getSelectedTabId()
    {
        return this.params.outputTo.querySelector('ul').getAttribute('data-selected');
    }
    
    

    /**
     * Get tab content container
     *
     * @param string|HTMLLIElement tab id of tab or HTMLLIElement
     * @return HTMLDivElement Returns container for tab
     */
    getTabContentNode(tab)
    {
        if ( typeof tab == 'string' )
            var target = document.getElementById(this.params.id + '_' + tab);
        else
            var target = tab;
        
		
        if ( !target )
            return;
        
		
		return document.getElementById(target.id + "Content");
    }
   
}
	
