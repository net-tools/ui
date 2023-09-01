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
		
		
		return tab;
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
	







// ==== DIALOGS ====

nettools.ui.desktop.dialog = nettools.ui.desktop.dialog || (function(){

	// ---- PRIVATE ----
	
	const CONFIRM = "confirm_div";
	const RICHEDIT = "richedit_div";
	const DIALOG = "dialog_div";
	const DYNAMICFORM = "dynamicform_div";
	const CUSTOMDIALOG = "customdialog_div";
	const PROMPT = "prompt_div";
	const TEXTAREA = "textarea_div";
	//_dialogHelper.MASQUE = "masque_div";
	const NOTIFY = "notify_div";

	
	
	// cache of created content
	var _divs = {};


    /**
	 * Add a hiddden submit button so that ENTER key submits form
	 *
	 * This is mandatory, because the submit button is placed outside the form
	 *
	 * @param HTMLFormElement form
	 * @param HTMLInputElement okbtn
	 */
    function _addHiddenSubmit(form, okbtn)
    {
        form.onsubmit = function(){ 
                // simulate click on OK button outside the form
                okbtn.onclick();
                return false;
            };

        // create a hidden submit button
        var subm = form.ownerDocument.createElement('input');
        subm.type='submit';
        subm.style.display = 'none';
        subm.style.visibility = 'hidden';

        form.appendChild(subm);
    }
	
	
	
	/**
	 * Add content to DOM, as first document child
	 * 
	 * @param HTMLDivElement div
	 * @return HTMLDivElement
	 */
	function _append(div)
	{
		document.body.insertBefore(div, document.body.firstChild);
		return div;
	}

	

	/**
	 * Get a dialog node or create it if not in cache
	 *
	 * @param string div Dialog identifier (see consts declarations above : CONFIRM, RICHEDIT, DIALOG, DYNAMIC_FORM, CUSTOM_DIALOG, PROMPT, TEXTAREA, NOTIFY)
	 * @return object Returns an object litteral with appropriate properties storing created content nodes
	 */
	function _get(div)
	{
		return _divs[div] || (_divs[div] = _createContent(div));
	}



	/**
	 * Hide a dialog
	 *
	 * @param string div Dialog identifier (see consts declarations above : CONFIRM, RICHEDIT, DIALOG, DYNAMIC_FORM, CUSTOM_DIALOG, PROMPT, TEXTAREA, NOTIFY)
	 */
	function _hide(div)
	{
		_show(div, 'hidden');
	}



	/** 
	 * Set a dialog visible or hidden
	 * 
	 * @param string div Dialog identifier (see consts declarations above : CONFIRM, RICHEDIT, DIALOG, DYNAMIC_FORM, CUSTOM_DIALOG, PROMPT, TEXTAREA, NOTIFY)
	 * @param string visible CSS visibility value
	 */
	function _show(div, visible)
	{
		_get(div).nodecenter.style.visibility = visible || 'visible';
	}


	
	/**
	 * Adjust dialog position on screen, given a width and height
	 *
	 * If w and h are set, window dialog is cented horizontally and vertically
	 * If w is set, the dialog width is set, and the dialog is centered horizontally
	 * If h is set and positive, the height is set to h and the dialog is vertically centered
	 * If h is set and negative, the height is set to abs(h) and the dialog is anchored to 10em top
	 * If h equals -1, the dialog is anchored to 10em top (no height set)
	 * if h equals 0, the dialog is centered (no width/height set)
	 * 
	 * @param string div Dialog identifier (see consts declarations above : CONFIRM, RICHEDIT, DIALOG, DYNAMIC_FORM, CUSTOM_DIALOG, PROMPT, TEXTAREA, NOTIFY)
	 * @param int w 
	 * @param int h
	 */
	function _center(div, w, h)
	{
		// reinit values, because dialog nodes are reused between calls
		var d = _get(div);
		d.node.style.height = null;
		d.node.style.width = null;
		d.node.className = d.node.className.replace(/ (uiDialogVCentered|uiDialogTopAligned)/g, '');


		// if no W and H values, center
		if ( !w && !h )
		{
			d.node.className += ' uiDialogVCentered';
			return;
		}


		// use Size object to process values and units easily
		var hSizeObject = new nettools.ui.Size(h);
		var wSizeObject = new nettools.ui.Size(w);


		// if H is set
		if ( !hSizeObject.isNull() )
			// and H is positive
			if ( hSizeObject.isPositive() )
			{
				d.node.className += ' uiDialogVCentered';
				if ( hSizeObject.size > 0)
					d.node.style.height = hSizeObject.toString();
			}
		
			// H not positive, set size and anchor to 10em top
			else
			{
				d.node.className += ' uiDialogTopAligned';

				if ( hSizeObject.size != -1 )
					d.node.style.height = hSizeObject.negate().toString();
			}


		// if W is set, set width
		if ( !wSizeObject.isNull() )
			d.node.style.width = wSizeObject.toString();
	}
		
		

	// create dialog node
	function _createContent(div)
	{
		var btns = `<div class="uiDialogButtons"><input type="button" value="${nettools.ui.desktop.dialog.i18n.BUTTON_OK}">&nbsp;&nbsp;&nbsp;<input type="button" value="${nettools.ui.desktop.dialog.i18n.BUTTON_CANCEL}"></div>`;
		

		switch ( div )
		{
			case RICHEDIT :
				document.body.insertAdjacentHTML('afterbegin', 
					`
					<div class="uiDialogWrapper" style="visibility:hidden;">
						<div class="uiForm uiDialog uiRichEditCadre">
							<form>
								<textarea style="visibility:hidden;" name="dialog_rte"></textarea>
								${btns}
							</form>
						</div>
					</div>
					`);
				
				
				// get newly created DOM content, inserted as first child
				var node = document.body.firstElementChild;


				return {
					nodecenter : node,
					node : node.firstElementChild,
					textarea : node.querySelector('textarea'),
					ok : node.getElementsByTagName('input')[0],
					cancel : node.getElementsByTagName('input')[1]
				};



			case DIALOG :
				document.body.insertAdjacentHTML('afterbegin', 
					`
					<div class="uiDialogWrapper" style="visibility:hidden;">
						<div class="uiForm uiDialog uiDialogCadre">
							<div class="uiDialogContent">
								<iframe frameborder="0" marginheight="0" marginwidth="0">...</iframe>
							</div>
							${btns}
						</div>
					</div>
					`);
				

				// get newly created DOM content, inserted as first child
				var node = document.body.firstElementChild;
				
				
				// add onload event to iframe
				var iframe = node.querySelector('iframe');
				iframe.onload = function(){
						var doc = this.contentDocument ? this.contentDocument : this.contentWindow.document;
						if ( doc && doc.forms[0] )
							_addHiddenSubmit(doc.forms[0], _get(DIALOG).ok);
					};

				
				return {
					nodecenter : node,
					node : node.firstElementChild,
					iframe : iframe,
					ok : node.getElementsByTagName('input')[0],
					cancel : node.getElementsByTagName('input')[1]
				};



			case CUSTOMDIALOG :
				document.body.insertAdjacentHTML('afterbegin', 
					`
					<div class="uiDialogWrapper" style="visibility:hidden;">
						<div class="uiForm uiDialog uiCustomDialogCadre">
							<div class="uiDialogContent"></div>
							${btns}
						</div>
					</div>
					`);
				

				// get newly created DOM content, inserted as first child
				var node = document.body.firstElementChild;

				
				return {
					nodecenter : node,
					node : node.firstElementChild,
					content : node.querySelector('.uiDialogContent'),
					ok : node.getElementsByTagName('input')[0],
					cancel : node.getElementsByTagName('input')[1]
				};	



			case CONFIRM :
				document.body.insertAdjacentHTML('afterbegin', 
					`
					<div class="uiDialogWrapper" style="visibility:hidden;">
						<div class="uiForm uiDialog uiConfirmCadre">
							<div class="uiDialogContent"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAppJREFUeNqkU0tPE1EY/e7M7UyBaZnCQKJAQVqDxMdCfBAjSuIDfMa4NHHFRl0aXejGR9yZkGiMO6OGH+BCFJWFLMREEiNKxAgmUNu0lFLaQimlnZnrd6dTGNbe5LR37nfOud+ce4cwxuB/BrV+dr8BEEQAIlAg5AAunUUEETU2bxHxBzEIjI0BM3UwDdAnzpQM7KECsOstjeqpgx1Nfq2mqlqWqMwL+by+Np/MZsa+hU/8jaSHcKkfkV7vAIcbXW91dbZe3NlW3xqNJoRHd7c4O5VvP1msV48EtYlfc+qXryFufId7C6W6ebwtqPUEW9RAPJ4SdN2AxwOTFt59ilmMYIMAyWRaCLR4A9ua1B6u2ejANHp3tdf7Y7EFUg51cLQI2ewKHN6zCHUVUZiaTsP4eAYopUTz1fpnZo1eTrMMmKEHJAreVKEAfPd0Jgu51VXo2OGGSyc1mJzJwauRHAgYiYn8YrHg5RpHBzou6pDLFyGznAcTWUSkcO+K3yo/eBEHKivrgZjgsjROg5n5hZXllYKoilIViDbx/I2Q9S9V+jadfT6/tsw1fF4K0TCGfv+MhD1elUluD3AQIsDo870W+Ly87pIVFg8vhLnG2cHwXCTWXaEoytbWYLOBN8p5Q6lUiUIPvpppRqanQulEYhhfcpjXrNTF5mf8JHyY5s1qre50Y1t7g+LTPC7ZLeP260Y/Pn74vpRMvMWAHuLNTRmhvpIBQRLxngOi9FDcphMv1QXkb0fU8k24uPvytUMjA08/g0iPsux7nS29BktbNigPIuEn4ApsJMZMEUjjMWzzvvWce9nJSvltMiB2Hi4eug3ZhsuC2LUPhP1Xodjfh88pRBK1OaeBYEO0QR3zco3zDH6SvBfUFv8JMAAv8hiRfYAaWQAAAABJRU5ErkJggg==" height="16" width="16" align="absmiddle"> <span class="uiPromptLib"></span></div>
							${btns}
						</div>
					</div>
					`);
				

				// get newly created DOM content, inserted as first child
				var node = document.body.firstElementChild;

				
				return {
					nodecenter : node,
					node : node.firstElementChild,
					lib : node.querySelector('span.uiPromptLib'),
					ok : node.getElementsByTagName('input')[0],
					cancel : node.getElementsByTagName('input')[1]
				};



			case NOTIFY :
				document.body.insertAdjacentHTML('afterbegin', 
					`
					<div class="uiDialogWrapper" style="visibility:hidden;">
						<div class="uiForm uiDialog uiConfirmCadre">
							<div class="uiDialogContent"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAjBJREFUeNqkk0trE1EUx8/cO49OfGTSRNJMYsA0aVonoYh13YW71uJCKFQhKqibfgFLwYULsR/AhY+VG1d+C124kJiFIGipmoIZNUXtZDKTycz1njGpaRNU8MJv7txzzv/c5xEYY/A/TRQEAW5c5KwM+aKcR73/a5zvg84HT371wv07Apwuj0x+PZW/vArA4NO7x/f4+OGoIHLKAAiC/fBdHadSbCGZPTeTzC7OUElbQNvBOISMMnIqeqFSYs57mTkfZD1/qYS2f0rAZ5pVDmXnY/FSbn3jM6xvfAEtfjKnRDLz6BtK4PPPADi+ms6vGK71lti2DUintUVSJ84b6OvF7GlI4PNMPVgAZ49oxpyqRnXf+wGWZYX4ngWRiKYfPpqfw5hBjej7eweqCkSo6JOLhmd/hI7vQLVaBdM0YXt1FgK2CeJ40fCbmxUWsGc8vh3egtcFQPhyLsQnzpQJcbVmuw5mawtqtRo0Gg3wJQeY7ALIrqZEM2WM7esIPkROAgR5OZEpTTV3X4IXNEGiLnw1b4fItBNCBQuiqeQUA7qMGtSSLt8C38aVRLo47QVvVJFYoFAnJJG8FdIfI6rSVWMTx6ZRg1rS7UKeSspSMj2Wk+AbjPGZ+vTboA1JZbQcEcUl1Iq2zdZyxURBpruUMTzR38Vl79wM+9bO0/3vlwLVs+OF16/MNdFug/vi+Xadm+vDL/3uHyuR16Er4E3gKvEaOTLa/1LBuEQPF8hxfgowAINnMqTBUH7hAAAAAElFTkSuQmCC" height="16" width="16" align="absmiddle"> <span class="uiPromptLib"></span></div>
							<div class="uiDialogButtons"><input type="submit" value="${nettools.ui.desktop.dialog.i18n.BUTTON_OK}"></div>
						</div>
					</div>
					`);
				

				// get newly created DOM content, inserted as first child
				var node = document.body.firstElementChild;

				
				return {
					nodecenter : node,
					node : node.firstElementChild,
					lib : node.querySelector('span.uiPromptLib'),
					ok : node.getElementsByTagName('input')[0]
				};



			case PROMPT :
				document.body.insertAdjacentHTML('afterbegin', 
					`
					<div class="uiDialogWrapper" style="visibility:hidden;">
						<div class="uiForm uiDialog uiPromptCadre">
							<div class="uiDialogContent">
								<div class="uiPromptLib"></div>
								<form><input type="text" name="value" class="uiPromptValue" onkeydown="if (event.keyCode === 27) _hide(PROMPT);"></form>
							</div>
							${btns}
						</div>
					</div>
					`);
				

				// get newly created DOM content, inserted as first child
				var node = document.body.firstElementChild;
				
				var form = node.querySelector('form');				
				_addHiddenSubmit(form, node.querySelector('input[type="submit"]'));

				

				return {
					nodecenter : node,
					node : node.firstElementChild,
					lib : node.querySelector('div.uiPromptLib'),
					input : node.querySelector('input.uiPromptValue'),
					form : form,
					ok : node.querySelectorAll('.uiDialogButtons input')[0],
					cancel : node.querySelectorAll('.uiDialogButtons input')[1],
				};



			case TEXTAREA :
				document.body.insertAdjacentHTML('afterbegin', 
					`
					<div class="uiDialogWrapper" style="visibility:hidden;">
						<div class="uiForm uiDialog uiTextAreaCadre">
							<div class="uiDialogContent">
								<div class="uiTextAreaLib"></div>
								<form><textarea class="uiTextAreaValue"></textarea></form>
							</div>
							${btns}
						</div>
					</div>
					`);
				

				// get newly created DOM content, inserted as first child
				var node = document.body.firstElementChild;

				
				return {
					nodecenter : node,
					node : node.firstElementChild,
					lib : node.querySelector('div.uiTextAreaLib'),
					input : node.querySelector('textarea'),
					form : node.querySelector('form'),
					ok : node.querySelectorAll('.uiDialogButtons input')[0],
					cancel : node.querySelectorAll('.uiDialogButtons input')[1],
				};				



			case DYNAMICFORM :
				document.body.insertAdjacentHTML('afterbegin', 
					`
					<div class="uiDialogWrapper" style="visibility:hidden;">
						<div class="uiForm uiDialog uiDynamicFormCadre">
							<div class="uiDialogContent">
								<form></form>
							</div>
						</div>
					</div>
					`);
				

				// get newly created DOM content, inserted as first child
				var node = document.body.firstElementChild;


				return {
					nodecenter : node,
					node : node.firstElementChild,
					form : node.querySelector('form')
				};
		}
	}

	// ---- /PRIVATE


	return {	
        
        // CONSTS
        ALIGN_CENTER : 0,
        ALIGN_DEFAULT : null,
        ALIGN_TOP : -1,
        
        
        
        /** 
         * Anchor a dialog window to 10em top, and set the height
         *
         * @param string|int h Dialog window height
		 * @return string Returns the height + unit
         */
        alignTop : function(h)
        {
            var size = new nettools.ui.Size(h);
            if ( size.isPositive() )
                return size.negate().toString();
            else
                return size.toString();
        },
        
        

        /** 
         * Center vertically a dialog window, and set the height
         *
         * @param string|int h Dialog window height
		 * @return string Returns the height + unit
         */
        center : function(h)
        {
            var size = new nettools.ui.Size(h);
            if ( size.isNegative() )
                return size.negate().toString();
            else
                return size.toString();
        },
        
        

        
		// ----- RICHEDIT -----
		
		/**
         * Richedit with Promise handling
         *
         * Window sizing is particular, since richEdit requires a large viewport :
         *   - if W is not set, then W = 80% of parent
		 *   - if H is not set, then richedit height equals 75% of window.innerHeight
		 *   - if H is set and positive, then richedit height is set with H, and the dialog window is centered
		 *   - if H is set and negative, then richedit height is set with abs(H), and the dialog window is anchored to 10em top
         *
         * @param string def Default value
         * @param int w Dialog window width
         * @param int h Dialog window height
         * @return Promise Returns a Promise resolved with value
         */
		richEditPromise : function(def, w, h)
		{
			return new Promise(
					function(resolve, reject)
					{
						nettools.ui.desktop.dialog.richEdit(def, w, h, resolve, reject);
					}
				);
		},
		
        
		
		/**
         * Richedit with Promise handling
         *
         * Window sizing is particular, since richEdit requires a large viewport :
         *   - if W is not set, then W = 80% of parent
		 *   - if H is not set, then richedit height equals 75% of window.innerHeight
		 *   - if H is set and positive, then richedit height is set with H, and the dialog window is centered
		 *   - if H is set and negative, then richedit height is set with abs(H), and the dialog window is anchored to 10em top
         *
         * @param string def Default value
         * @param int w Dialog window width
         * @param int h Dialog window height
         * @param function(string) cb Callback called when the user clicks on OK button
         * @param function() cbcancel Callback called when the user clicks on CANCEL button
         */
		richEdit : function(def, w, h, cb, cbcancel)
		{
			if ( !window.tinymce )
			{
				nettools.ui.desktop.dialog.prompt('TINYMCE missing !', def, cb, true);
				return;
			}

			
			// créer ou obtenir DIV
			var div = _get(RICHEDIT);
            
            
            // raz styles
            div.node.className = div.node.className.replace(/ (uiDialogVCentered|uiDialogTopAligned|uiRichEditCadreWMax)/g, '');
            div.node.style.width = null;
            
            
            // - set width or center with max width
            if ( !w )
                div.node.className += ' uiRichEditCadreWMax';
            else
                div.node.style.width = new nettools.ui.Size(w).toString();
                
            
            // - set height 
            var hObject = new nettools.ui.Size(h);
            
            if ( hObject.isNull() || hObject.isPositive() || (hObject.unit != 'px') )
                div.node.className += ' uiDialogVCentered';
            
            
            // if H negative and unit is 'px', set height to abs(H) and anchor to 10em top
            if ( hObject.isNegative() && (hObject.unit == 'px') )
            {
                div.node.className += ' uiDialogTopAligned';
                hObject = hObject.negate();
            }
            
            
            // si other unit than PX
            if ( hObject.unit != 'px' )
                hObject = new nettools.ui.Size(null);
                

			// content
			div.textarea.value = def;
			
			
			tinymce.init({
				/* textarea */
				target: div.textarea,
				
				/* setup events on OK and CANCEL */
				setup : function(ed)
					{
						ed.on('init', function(e)
							{
								div.ok.onclick=function(){ 
									// closing dialog window et TMCE
									_hide(RICHEDIT);
						
									var val = ed.getContent();
									try{ed.remove();}catch (e){}
									
									// callback with value
									if ( cb && (typeof cb === 'function') )
										cb(val);
						
									return false;
								};
								
								

								div.cancel.onclick=function(){ 
									// closing dialog window et TMCE
									_hide(RICHEDIT);
									try{ed.remove();}catch (e){}
									
									
									// callback
									if ( cbcancel && (typeof cbcancel === 'function') )
										cbcancel();
								};
							});
					},
				
				/* height for editable field */
				height:(hObject.isNull() ? (window.innerHeight - 140) : hObject.size) + 'px',
				
				/* URL handling : do not rewrite them */
				remove_script_host : false,
				relative_urls : false,
				
				/* langue */
/*				language : 'fr_FR',
				language_url : '/lib/tinymce/langs/fr_FR.js',*/
				
				/* plugins */
				plugins: "lists advlist anchor autolink charmap code fullscreen link nonbreaking paste print preview quickbars searchreplace visualblocks visualchars",				
				
				/* toolbar */
				toolbar: 'undo redo | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | outdent indent bullist numlist | preview code | charmap nonbreaking'
			});


			// set the dialog window visible
			_show(RICHEDIT);
		},	
		
		
		
		// ---- NOTIFY -----	
		
		/**
         * Notify window with Promise
         *
         * @param string lib Message
         * @param int w Dialog width ; if set, the dialog is centered ; if not set, default width used
         * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered ; if not set, anchored to 10em top
         * @return Promise Returns a Promise resolved when user clicks on OK button
         */
		notifyPromise : function(lib, w, h)
		{
			return new Promise(
						function(resolve, reject)
						{
							nettools.ui.desktop.dialog.notify(lib, resolve, w, h);
						}
					);
		},
        
		
	
		/**
         * Notify window
         *
         * @param string lib Message
		 * @param function() cb Callback called when user clicks on OK button
         * @param int w Dialog width ; if set, the dialog is centered ; if not set, default width used
         * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered ; if not set, anchored to 10em top
         */
		notify : function(lib, cb, w, h)
		{
			var div = _get(NOTIFY);
			div.lib.innerHTML = lib;
			
			// center
            _center(NOTIFY, w, (h!=nettools.ui.desktop.dialog.ALIGN_DEFAULT)?h:nettools.ui.desktop.dialog.ALIGN_TOP);
			

			// ok button
			div.ok.onclick=function(){ 
				_hide(NOTIFY);
			
				if ( cb && (typeof cb === 'function') )
					cb();
				
				return false;
			};
		
		
			// set dialog window visible and focus on OK button
			_show(NOTIFY);
			div.ok.focus();
		},
		
		
	
		// ---- CONFIRM ----
	
		/**
         * Confirm window with Promise
         *
         * @param string lib Message
         * @param int w Dialog width ; if set, the dialog is centered ; if not set, default width used
         * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered ; if not set, anchored to 10em top
         * @return Promise Returns a Promise resolved or rejected depending on user choice (OK or CANCEL)
         */
		confirmPromise : function(lib, w, h)
		{
			return new Promise(
						function(resolve, reject)
						{
							nettools.ui.desktop.dialog.confirm(lib, resolve, w, h, reject);
						}
					);
		},

		
        
		/**
         * Confirm window 
         *
         * @param string lib Message
		 * @param function() cb Callback called when user clicks on OK button
         * @param int w Dialog width ; if set, the dialog is centered ; if not set, default width used
         * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered ; if not set, anchored to 10em top
		 * @param function() cbcancel Callback called when user clicks on CANCEL button
         */
		confirm : function (lib, cb, w, h, cbcancel)
		{
			var div = _get(CONFIRM);
			div.lib.innerHTML = lib;
			
			// center
            _center(CONFIRM, w, (h!=nettools.ui.desktop.dialog.ALIGN_DEFAULT)?h:nettools.ui.desktop.dialog.ALIGN_TOP);
			
			
			// ok button
			div.ok.onclick=function(){ 
				_hide(CONFIRM);
			
				if ( cb && (typeof cb === 'function') )
					cb();
				
				return false;
			};
		
		
			// CANCEL button
			div.cancel.onclick=function(){ 
				_hide(CONFIRM);
				
				if ( cbcancel && (typeof cbcancel === 'function') )
					cbcancel();
			};
			
			
			// set window visible and focus on OK button
			_show(CONFIRM);
			div.ok.focus();
		},
		
	
	
		// ---- SHOW DIALOG ----
                
		/**
         * Display an iframe as dialog window and returns a Promise
         * 
         * @param string src Path to iframe src
         * @param int w Dialog width ; if set, the dialog is centered
         * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered
         * @param function(HTMLDocument) cbv Callback called to validate inputs
         * @param bool showCancel May be set to TRUE to display CANCEL button
         * @return Promise Returns a Promise resolved when users clicks on OK button, with a object litteral as value {HTMLFormElement form, HTMLInputElement[] elements}, rejected if CANCEL button clicked
         */
        showPromise : function(src, w, h, cbv, showCancel)
        {
			return new Promise(
					function(resolve, reject)
					{
                        nettools.ui.desktop.dialog.show(src, w, h, function(f, e, d){resolve({form:f, elements:e});}, cbv, reject, showCancel);
                    }
                );
        },
        
        
	
		/**
         * Display an iframe as dialog window and returns a Promise
         * 
         * @param string src Path to iframe src
         * @param int w Dialog width ; if set, the dialog is centered
         * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered
         * @param nettools.jscore.SubmitHandlers.Handler|function(HTMLForm, HTMLElements[]) cb Submit handler or callback called when user clicks on OK button
         * @param function(HTMLDocument) cbv Callback called to validate inputs
         * @param function() cbcancel Callback called when user clicks on CANCEL button
         * @param bool showCancel May be set to TRUE to display CANCEL button
         */
		show : function(src, w, h, cb, cbv, cbcancel, showCancel)
		{
			var div = _get(DIALOG);
			if ( showCancel === undefined )
				showCancel = true;

			// center
			_center(DIALOG, w, h);
			
			
			// OK button
			div.ok.onclick=function(){ 
				// if validation callback
				if ( cbv && (typeof cbv === 'function') )
				{
					// if validation issue, don't close window
					if ( !cbv (div.iframe.contentDocument ? div.iframe.contentDocument : div.iframe.contentWindow.document) )
						return false;
				}
	
				// hiding dialog window
				_hide(DIALOG);
	
				// client callback
				var doc = div.iframe.contentDocument ? div.iframe.contentDocument : div.iframe.contentWindow.document;
				var sub = nettools.jscore.SubmitHandlers.Callback.toSubmitHandler(cb);
				sub.submit(doc.forms[0], doc.forms[0].elements);
	
				return false;
			};
			
			
			// CANCEL button
			div.cancel.onclick=function(){ 
				_hide(DIALOG);
				
				if ( cbcancel&& (typeof cbcancel === 'function') )
					cbcancel(); 
			};
			
			if ( !showCancel )
			{
				div.cancel.style.visibility = 'hidden';
				div.cancel.style.display = 'none';
			}
			else
			{
				div.cancel.style.visibility = 'inherit';
				div.cancel.style.display = 'inline';
			}
			
			
			// iframe loading
			div.iframe.src = '';			
			window.setTimeout(function()
					{
						div.iframe.src = src;
					}, 
					
					100
				);
				
		
		
			// dialog visible now
			_show(DIALOG);
		},
		
        
		
		/**
         * Display an iframe as dialog window and submit it at the same address as POST request
         * 
         * @param string src Path to iframe src
         * @param int w Dialog width ; if set, the dialog is centered
         * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered
         * @param function(HTMLDocument) cbv Callback called to validate inputs
         * @param function() cbcancel Callback called when user clicks on CANCEL button
         */
		showAndSubmit : function (src, w, h, cbv, cbcancel)
		{
			var url = src.match(/.*\?/);
			if ( url )
				src = url[0].substr(0, url[0].length - 1);	// remove trailing ?
			
			
			nettools.ui.desktop.dialog.show(src, w, h,  
						
						new nettools.jscore.SubmitHandlers.Post ({
							target : src
						}),
											

						// validate
						function (doc)
						{
							if ( cbv && (typeof cbv === 'function') )
								return cbv(doc);
							else
								return true;
						},
						
									   
						// cancel button
						cbcancel
					);
		},
		
				
		
		// ---- DYNAMIC FORM ----

		/**
         * Create a dialog window with dynamically created fields
         *
         * @param object params Object litteral describing fields (see nettools.ui.FormBuilder)
         * @param string formClassName CSS style to apply to form
         * @param int w Dialog width ; if set, the dialog is centered
         * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered ; if not set, dialog is centered (no height set)
         * @param function(HTMLFormElement, HTMLInputElement[]) onload Callback called when dialog window is ready
         */
		dynamicForm : function (params, formClassName, w, h, onload)
		{
			// set target container form nettools.ui.FormBuilder
			params.target = _get(DYNAMICFORM).form;
			
            
			// empty form, because it may have been used before
			params.target.innerHTML = "";
            var btns = _get(DYNAMICFORM).node.querySelector('div.uiDialogButtons');
            if ( btns )
                btns.parentNode.removeChild(btns);
			
            
			// init css
			params.target.className = 'uiForm';
			if ( formClassName )
				params.target.classList.add(formClassName);
	
            
			// add more processing to SUBMIT and CANCEL handlers
			params.submit = nettools.jscore.SubmitHandlers.Callback.toSubmitHandler(params['submit']).customEvent(
				function(form, elements)
				{
					_hide(DYNAMICFORM); 
				});
			
			if ( params['cancel'] )
			{
				var cbcancel = params.cancel;
				params.cancel = function(form)
					{
						cbcancel(form);					
						_hide(DYNAMICFORM); 
					};
			}
			else
				params.cancel = function(form)
					{
						_hide(DYNAMICFORM); 
					};
            
							
			// create form thanks to nettools.ui.FormBuilder ; form is created inside params.target node
			nettools.ui.FormBuilder.createForm(params);
						
            
			// centering and styling
			_center(DYNAMICFORM, w, h);
			params.target.firstChild.style.marginTop = '0px';
            
            
            // move buttons DIV outside form
            var btns = params.target.querySelector('.FormBuilderButtons');
            btns.className = 'uiDialogButtons';
            _get(DYNAMICFORM).node.appendChild(btns);
            btns.insertBefore(document.createTextNode('\u00A0\u00A0\u00A0'), btns.lastChild);
            
            
            // add form 'onsubmit' event on SUBMIT button since we are outside the form, auto-submit can't work
            btns.firstChild.onclick = params.target.onsubmit;

            
            // add hidden submit inside form, so that ENTER key submit works
            _addHiddenSubmit(params.target, btns.firstChild);
            

			// dialog window is now visible
			_show(DYNAMICFORM);

            
			// set focus to first field
			if ( params.target.elements[0].focus )
				params.target.elements[0].focus();

			
			// custom onload event 
			if ( typeof onload == 'function' )
				onload(params.target, params.target.elements);
		},
	
	
				
		// ---- CUSTOM DIALOG ----
		
		/**
         * Custom dialog as HTML and returning a Promise
         * 
		 * @param string|function(HTMLElement) html String holding HTML data inside a top-level tag (such as P or DIV), or a callback function creating dialog inside its argument (DOM node)
         * @param int w Dialog width ; if set, the dialog is centered
         * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered
         * @param function(HTMLElement) cbv Validation callback, receiving as argument the HTML tag the dialog is built into
         * @param bool showCancel Do we need the CANCEL button ?
         * @return Promise Returns a Promise resolved with the HTML tag the dialog is built into
         */
		customDialogPromise : function(html, w, h, cbv, showCancel)
		{
			return new Promise(
					function(resolve, reject)
					{
						nettools.ui.desktop.dialog.customDialog(html, w, h, resolve, cbv, reject, showCancel);
					}
				);
		},
		
        
		
		/**
         * Custom dialog as HTML
         * 
		 * @param string|function(HTMLElement) html String holding HTML data inside a top-level tag (such as P or DIV), or a callback function creating dialog inside its argument (DOM node)
         * @param int w Dialog width ; if set, the dialog is centered
         * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered
         * @param function(HTMLElement) cb Callback called when user clicks on OK button, receiving as argument the HTML tag the dialog is build into
         * @param function(HTMLElement) cbv Validation callback, receiving as argument the HTML tag the dialog is built into
         * @param function() cbcancel Callback called when user clicks on CANCEL button
         * @param bool showCancel Do we need the CANCEL button ?
         */
		customDialog : function (html, w, h, cb, cbv, cbcancel, showCancel)
		{
			var target = _get(CUSTOMDIALOG);
			
			if ( showCancel === undefined )
				showCancel = true;
			

			target.content.innerHTML = "";
			
			// creating dialog either with callback or through HTML string
			if ( typeof html === 'function' )
				html(target.content);
			else
				target.content.innerHTML = html;
				
			
			// centering and CSS
			_center(CUSTOMDIALOG, w, h);
			target.content.firstChild.style.marginTop = '0px';


			// OK button
			target.ok.onclick = function(){ 
				
				// validation
				if ( cbv && (typeof cbv === 'function') )
				{
					if ( !cbv (target.content) )
						return false;
				}

				
				// hiding
				_hide(CUSTOMDIALOG);
			
				
				// client callback
				if ( cb && (typeof cb === 'function') )
					cb(target.content);
				
				return false;
			};
		
		
			
			// CANCEL button
			target.cancel.onclick = function(){ 
				_hide(CUSTOMDIALOG);

				if ( cbcancel && (typeof cbcancel === 'function') )
					cbcancel(target.content);
			};
			
			
			if ( !showCancel )
			{
				target.cancel.style.visibility = 'hidden';
				target.cancel.style.display = 'none';
			}
			else
			{
				target.cancel.style.visibility = 'inherit';
				target.cancel.style.display = 'inline';
			}
            
            
            // adding hidden submit if a FORM is found inside HTML
            var form = target.content.querySelector('form');
            if ( form )
                _addHiddenSubmit(form, target.ok);
			
			
			// dialog window is now visible
			_show(CUSTOMDIALOG);
            
            
            // focus on first input
            var input = target.content.querySelector('input');
            if ( input && (typeof input.focus == 'function') )
                input.focus();
            else
                target.ok.focus();
		},
		
				
		
		// ---- NOTIFY		
        
		/**
         * Custom notification window as HTML and returning a Promise
         * 
		 * @param string|function(HTMLElement) html String holding HTML data inside a top-level tag (such as P or DIV), or a callback function creating dialog inside its argument (DOM node)
         * @param int w Dialog width ; if set, the dialog is centered
         * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered ; if not set, anchored 10em top
         * @return Promise Returns a Promise resolved when user clicks on OK button
         */
		customNotifyPromise : function(html, w, h)
		{
			return new Promise(
					function(resolve, reject)
					{
						nettools.ui.desktop.dialog.customNotify(html, w, h, resolve);
					}
				);
		},
		
        
		
		/**
         * Custom notification window as HTML
         * 
		 * @param string|function(HTMLElement) html String holding HTML data inside a top-level tag (such as P or DIV), or a callback function creating dialog inside its argument (DOM node)
         * @param int w Dialog width ; if set, the dialog is centered
         * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered ; if not set, anchored 10em top
		 * @param function() cb Callback called when user clicks on OK button
         */
		customNotify : function(html, w, h, cb)
		{
            // if no width set, computing width
            if ( !w )
            {
                // creating a DIV with css style 'uiNotifyCadre' so that we can get the width defined in the style
                var tmp = document.createElement('div');
                tmp.className = 'uiNotifyCadre';
                tmp.style.display = 'none';
                tmp.style.visibility = 'hidden';
                document.body.appendChild(tmp);
                w = getComputedStyle(tmp).width;        // dans chrome, il faut que l'élément soit dans le DOM pour que getComputedStyle marche
                document.body.removeChild(tmp);
                tmp = null;
            }
            
			nettools.ui.desktop.dialog.customDialog(html, w, (h!=nettools.ui.desktop.dialog.ALIGN_DEFAULT) ? h : nettools.ui.desktop.dialog.ALIGN_TOP, cb, null, null, false);
		},
	
	
	
		// ---- PROMPT ----
		
		/**
         * Custom prompt window, returning a Promise
         * 
		 * @param string lib Prompt string
		 * @param string defvalue Default value for prompt
		 * @param bool textarea True if we require a textarea, false otherwise
		 * @param string textareacssclass Makes it possible to apply a custom style to textarea (so that proper CSS width/height/format can be applied)
         * @return Promise Returns a Promise resolved with the value in the prompt when user clicks on OK button
         */
		promptPromise : function(lib, defvalue, textarea, textareacssclass)
		{
			return new Promise(
					function(resolve, reject)
					{
						nettools.ui.desktop.dialog.prompt(lib, defvalue, resolve, textarea, textareacssclass, reject);
					}
				);
		},
		

        
		/**
         * Custom prompt window
         * 
		 * @param string lib Prompt string
		 * @param string defvalue Default value for prompt
		 * @param nettools.jscore.SubmitHandlers|function(string) cb Submit handler or callback called when the user clicks on OK button, with the value of the INPUT as only argument
		 * @param bool textarea True if we require a textarea, false otherwise
		 * @param string textareacssclass Makes it possible to apply a custom style to textarea (so that proper CSS width/height/format can be applied)
         * @param function() cbcancel Called when the user clicks on CANCEL button
         */
		prompt : function(lib, defvalue, cb, textarea, textareacssclass, cbcancel)
		{
			var divname = textarea ? TEXTAREA : PROMPT;
			var div = _get(divname);

				
			// set lib and default value
			div.lib.innerHTML = lib;
			div.input.value = defvalue;
			
			if ( textareacssclass )
				div.input.className = 'uiPromptValue ' + textareacssclass;
			else
				div.input.className = 'uiPromptValue';

            
            // sizing
            _center(divname, nettools.ui.desktop.dialog.ALIGN_DEFAULT, textarea ? nettools.ui.desktop.dialog.ALIGN_CENTER : nettools.ui.desktop.dialog.ALIGN_TOP);


	
			// OK button
			div.ok.onclick=function(){ 
				// hiding dialog
				_hide(divname);
			
				
				// if cb is a function(string) callback, updating function declaration, because nettools.jscore.SubmitHandlers.Callback signature is (form, elements[])
				if ( cb )
				{
					if ( typeof cb === 'function' )
					{
						var cbold = cb;
						cb = new nettools.jscore.SubmitHandlers.Callback(
							{ 
								target : function(form, elements) 
									{
										cbold(elements[0].value);
									}
							});
					}
				}
				else
					cb = new nettools.jscore.SubmitHandlers.Callback.dummy();
			
				
				// submitting through SubmitHandler.Handler process
				cb.submit(div.form, [div.input]);
				
				return false;
			};
		
		
			// CANCEL button
			div.cancel.onclick=function(){ 
				_hide(divname);
				
				if ( cbcancel && (typeof cbcancel === 'function') )
					cbcancel();
			};
		
		
			// dialog window visible and focus set on input
			_show(divname);
			div.input.focus();
		}
	};
})();


// i18n
nettools.ui.desktop.dialog.i18n = {
	BUTTON_OK : ' OK ',
	BUTTON_CANCEL : 'Cancel'
}

