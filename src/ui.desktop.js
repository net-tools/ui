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
    
    
    
    // EscapeBehavior event handler
    function _inputOnKeyDownEscapeBehavior(userCb, e)
    {
        // keys V, v, c, C pressed ?
        var kc = (e || window.event).keyCode;
        if ( kc == 27 )
		{
			// call user callback
			if ( typeof userCb === 'function' )
				userCb();
			
            return false;
		}
        else
            return true;	// not handled
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
		 * Detect ESCAPE keypress and call user callback
		 *
         * @param HTMLInputElement input
         * @param function() cb User callback called when ESCAPE key is pressed to handle dialog cancelation
		 */		 
		escapeBehavior : function(input, cb)
		{
			nettools.ui.desktop.InputHelper.inputAddKeyBehavior(input, _inputOnKeyDownEscapeBehavior.bind(input, cb));
		},
		
        
		
		/**
         * Add a specific behavior to an input
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
            iframe.src = this.params.tabs[i].url;
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

nettools.ui.desktop.dialogs = {};

nettools.ui.desktop.dialogs.Window = class {
	
	/**
	 * Constructor of dialog window
	 *
	 * @param string kind Window type (from nettools.ui.desktop.dialog consts : CONFIRM, RICHEDIT, DIALOG, DYNAMICFORM, CUSTOMDIALOG, PROMPT, TEXTAREA, NOTIFY)
	 */
	constructor(kind)
	{
		this.node = null;
		this.nodecenter = null;
		this.kind = kind;
		this.content = null;
	}
	
	
	
	/**
	 * Get buttons line
	 *
	 * @return string
	 */
	buttonsLine()
	{
		return `<div class="uiDialogButtons"><input type="button" value="${nettools.ui.desktop.dialog.i18n.BUTTON_OK}">&nbsp;&nbsp;&nbsp;<input type="button" value="${nettools.ui.desktop.dialog.i18n.BUTTON_CANCEL}"></div>`;
	}
	
	
	
	/**
	 * Build dialog window HTML 
	 */
	buildHTML()
	{
return `<div class="uiDialogWrapper" style="visibility:hidden;">
	<div class="uiForm uiDialog ui${this.kind}Frame">
		<div class="uiDialogContent">${this.build()}</div>
		${this.buttonsLine()}
	</div>
</div>`;
	}
	
	
	
	/**
	 * Create dialog content
	 *
	 * @return string
	 */
	build()
	{
		return '';
	}
	
	
	
	/**
	 * Show or hide dialog window
	 * 
	 * @param bool visible
	 */
	show(visible)
	{
		if ( visible === undefined )
			visible = true;
		
		this.nodecenter.style.visibility = visible ? 'visible' : 'hidden';
	}
	
	
	
	/**
	 * Hide window
	 */
	hide()
	{
		this.show(false);
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
	 * @param int w Width 
	 * @param int h Height
	 * @param string cssClass Custom CSS classname to set to window frame
	 */
	center(w, h, cssClass)
	{
		this.node.style.height = null;
		this.node.style.width = null;
		this.node.classList.remove('uiDialogVCentered');
		this.node.classList.remove('uiDialogTopAligned');
		
		
		
		// reset CSS
		var css = this.node.getAttribute('data-customcss');
		if ( css )
		{
			var that = this;
			css.split(/ /).forEach(function(v){ that.node.classList.remove(v); });
			this.node.removeAttribute('data-customcss');
		}
		
		
		// set CSS		
		if ( cssClass )
		{
			var that = this;
			cssClass.split(/ /).forEach(function(v){ that.node.classList.add(v); });
			this.node.setAttribute('data-customcss', cssClass);
		}
			
			


		// if no W and H values, center
		if ( !w && !h )
		{
			this.node.className += ' uiDialogVCentered';
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
				this.node.className += ' uiDialogVCentered';
				if ( hSizeObject.size > 0)
					this.node.style.height = hSizeObject.toString();
			}
		
			// H not positive, set size and anchor to 10em top
			else
			{
				this.node.className += ' uiDialogTopAligned';

				if ( hSizeObject.size != -1 )
					this.node.style.height = hSizeObject.negate().toString();
			}


		// if W is set, set width
		if ( !wSizeObject.isNull() )
			this.node.style.width = wSizeObject.toString();
	}
	
	
	
	/**
	 * Create dialog	 
	 */
	create()
	{
		document.body.insertAdjacentHTML('afterbegin', this.buildHTML());

		// get newly created DOM content, inserted as first child
		this.nodecenter = document.body.firstElementChild;
		this.node = this.nodecenter.firstElementChild;
		this.content = this.node.querySelector('.uiDialogContent');
	}
	
	
	
	/** 
	 * Get dialog ready
	 *
	 * @return nettools.ui.desktop.dialogs.Window
	 */
	prepare()
	{
		this.create();
		return this;
	}
	
	
	
	/**
	 * Execute dialog with appropriate parameters
	 */
	execute()
	{
		throw new Error("'execute' method not defined");
	}
}







nettools.ui.desktop.dialogs.OkCancelWindow = class extends nettools.ui.desktop.dialogs.Window {
	
	/** 
	 * Constructor of a window with OK and CANCEL buttons
	 *
	 * @param string kind Window type (from nettools.ui.desktop.dialog consts : CONFIRM, RICHEDIT, DIALOG, DYNAMICFORM, CUSTOMDIALOG, PROMPT, TEXTAREA, NOTIFY)
	 */	 
	constructor(kind)
	{
		super(kind);
		
		this.ok = null;
		this.cancel = null;
	}
	
	
	
    /**
	 * Add a hiddden submit button so that ENTER key submits form
	 *
	 * This is mandatory, because the submit button is placed outside the form
	 *
	 * @param HTMLFormElement form
	 * @param HTMLInputElement okbtn
	 */
    static _addHiddenSubmit(form, okbtn)
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
	 * Create dialog	 
	 */
	create()
	{
		super.create();


		// detect key created HTML elements
		this.ok = this.node.querySelectorAll('.uiDialogButtons input')[0];
		this.cancel = this.node.querySelectorAll('.uiDialogButtons input')[1];
	}
	
	
	
	/**
	 * Cancel dialog
	 *
	 * @param function() cbcancel Callback called when user clicks on CANCEL button ; null may be used if no reaction to dialog cancelation is required
	 */
	cancelDialog(cbcancel)
	{
		if ( cbcancel && (typeof cbcancel === 'function') )
			cbcancel(); 
	}
	
	
	
	/**
	 * Validate dialog inputs ; must be defined in child classes to handle proper validation
	 *
	 * @param function(...) cbv Callback called to validate inputs ; null may be used if no validation is required
	 * @return bool Returns True if validation is OK
	 */
	validateDialog(cbv)
	{
		return true;
	}
	
	
	
	/**
	 * Submit dialog inputs ; must be defined in child classes to handle proper submit process
	 *
	 * @param function() cb Callback called to submit dialog 
	 */
	submitDialog(cb)
	{
		if ( cb && (typeof cb === 'function') )
			cb(); 
	}
	
	
	
	/**
	 * Prepare OK and CANCEL buttons for handling user clicks and hiding dialog windows
	 *
	 * @param nettools.jscore.SubmitHandlers.Handler|function(HTMLForm, HTMLElements[]) cb Submit handler or callback called when user clicks on OK button
	 * @param function(...) cbv Callback called to validate inputs ; null may be used if no validation is required
	 * @param function() cbcancel Callback called when user clicks on CANCEL button ; null may be used if no reaction to dialog cancelation is required
	 */
	setButtonsEvents(cb, cbv, cbcancel)
	{
		var that = this;
		
		this.ok.onclick = function()
		{ 
			if ( that.validateDialog(cbv) )
			{
				// hiding dialog window
				that.hide();
				
				// submit dialog
				that.submitDialog(cb);

				return false;
			}
		};


		// CANCEL button
		if ( this.cancel )
		{
			this.cancel.onclick = function()
			{ 
				// hiding dialog
				that.hide();

				// cancel dialog
				that.cancelDialog(cbcancel);
			};
			
			
			
			// add ESCAPE key behavior
			nettools.ui.desktop.InputHelper.escapeBehavior(this.node, this.cancel.onclick);
		}
		
		
	}
}







nettools.ui.desktop.dialogs.DialogWindow = class extends nettools.ui.desktop.dialogs.OkCancelWindow {
	
	/** 
	 * Constructor of DIALOG window
	 *
	 * @param string kind Window type (from nettools.ui.desktop.dialog consts : CONFIRM, RICHEDIT, DIALOG, DYNAMICFORM, CUSTOMDIALOG, PROMPT, TEXTAREA, NOTIFY)
	 */	 
	constructor(kind)
	{
		super(kind);
		
		this.iframe = null;
	}
	
	
	
	/**
	 * Create dialog content
	 *
	 * @return string
	 */
	build()
	{
		return '<iframe frameborder="0" marginheight="0" marginwidth="0">...</iframe>';
	}
	
	
	
	/**
	 * Create dialog	 
	 */
	create()
	{
		super.create();


		// detect key created HTML elements
		this.iframe = this.node.querySelector('iframe'); 

		
		// add onload event to iframe
		var that = this;
		this.iframe.onload = function(){
				var doc = this.contentDocument ? this.contentDocument : this.contentWindow.document;
				if ( doc && doc.forms[0] )
					that.constructor._addHiddenSubmit(doc.forms[0], that.ok);
			};
	}
	
	
	
	/**
	 * Validate dialog inputs of iframe
	 *
	 * @param function(HTMLDocument) cbv Callback called to validate inputs ; null may be used if no validation is required
	 * @return bool Returns True if validation is OK
	 */
	validateDialog(cbv)
	{
		if ( !cbv )
			return true;
		
		return cbv(this.iframe.contentDocument ? this.iframe.contentDocument : this.iframe.contentWindow.document);
	}
	
	
	
	/**
	 * Submit dialog inputs of iframe
	 *
	 * @param nettools.jscore.SubmitHandlers.Handler|function(HTMLForm, HTMLElements[]) cb Submit handler or callback called when user clicks on OK button
	 */
	submitDialog(cb)
	{
		var doc = this.iframe.contentDocument ? this.iframe.contentDocument : this.iframe.contentWindow.document;
		var sub = nettools.jscore.SubmitHandlers.Callback.toSubmitHandler(cb);
		sub.submit(doc.forms[0], doc.forms[0].elements);
	}
	
	
	
	/**
	 * Execute dialog with appropriate parameters
	 * 
	 * @param string src Path to iframe src
	 * @param int w Dialog width ; if set, the dialog is centered
	 * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered
	 * @param nettools.jscore.SubmitHandlers.Handler|function(HTMLForm, HTMLElements[]) cb Submit handler or callback called when user clicks on OK button
	 * @param function(HTMLDocument) cbv Callback called to validate inputs
	 * @param function() cbcancel Callback called when user clicks on CANCEL button
	 * @param bool showCancel May be set to TRUE to display CANCEL button
	 * @param string cssClass CSS classname to set to window frame
	 */
	execute(src, w, h, cb, cbv, cbcancel, showCancel, cssClass)
	{
		if ( showCancel === undefined )
			showCancel = true;

		// center
		this.center(w, h, cssClass);


		// OK button : OK callback, validation callback, CANCEL callback
		this.setButtonsEvents(cb, cbv, cbcancel);
		
		
		if ( !showCancel )
		{
			this.cancel.style.visibility = 'hidden';
			this.cancel.style.display = 'none';
		}
		else
		{
			this.cancel.style.visibility = 'inherit';
			this.cancel.style.display = 'inline';
		}
		
		
		// iframe loading
		this.iframe.src = '';		
		var that = this;
		window.setTimeout(function()
				{
					that.iframe.src = src;
				}, 

				100
			);



		// dialog visible now
		this.show();
	}	
}






nettools.ui.desktop.dialogs.CustomDialogWindow = class extends nettools.ui.desktop.dialogs.OkCancelWindow {
	
	/**
	 * Validate dialog inputs of custom dialog
	 *
	 * @param function(HTMLElement) cbv Callback called to validate inputs ; the callback argument is the HTML tag the dialog is built into
	 * @return bool Returns True if validation is OK
	 */
	validateDialog(cbv)
	{
		if ( !cbv )
			return true;
		
		return cbv(this.content);
	}
	
	
	
	/**
	 * Submit dialog inputs of custom dialog
	 *
	 * @param function(HTMLElement) cb Callback called when user clicks on OK button, receiving as argument the HTML tag the dialog is built into
	 */
	submitDialog(cb)
	{
		if ( cb && (typeof cb === 'function') )
			cb(this.content);
	}

	
	
	/**
	 * Execute custom dialog built as HTML with appropriate parameters
	 * 
	 * @param string|function(HTMLElement) html String holding HTML data inside a top-level tag (such as P or DIV), or a callback function creating dialog inside its argument (DOM node)
	 * @param int w Dialog width ; if set, the dialog is centered
	 * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered
	 * @param function(HTMLElement) cb Callback called when user clicks on OK button, receiving as argument the HTML tag the dialog is built into
	 * @param function(HTMLElement) cbv Validation callback, receiving as argument the HTML tag the dialog is built into
	 * @param function() cbcancel Callback called when user clicks on CANCEL button
	 * @param bool showCancel Do we need the CANCEL button ?
	 */
	execute(html, w, h, cb, cbv, cbcancel, showCancel)
	{
		if ( showCancel === undefined )
			showCancel = true;


		this.content.innerHTML = "";

		// creating dialog either with callback or through HTML string
		if ( typeof html === 'function' )
			html(this.content);
		else
			this.content.innerHTML = html;


		// centering and CSS
		this.center(w, h);
		this.content.firstChild.style.marginTop = '0px';


		// OK button
		this.setButtonsEvents(cb, cbv, cbcancel);


		if ( !showCancel )
		{
			this.cancel.style.visibility = 'hidden';
			this.cancel.style.display = 'none';
		}
		else
		{
			this.cancel.style.visibility = 'inherit';
			this.cancel.style.display = 'inline';
		}


		// adding hidden submit if a FORM is found inside HTML
		var form = this.content.querySelector('form');
		if ( form )
			nettools.ui.desktop.dialogs.OkCancelWindow._addHiddenSubmit(form, this.ok);


		// dialog window is now visible
		this.show();


		// focus on first input
		var input = this.content.querySelector('input');
		if ( input && (typeof input.focus == 'function') )
			input.focus();
		else
			this.ok.focus();
	}			
	
}






nettools.ui.desktop.dialogs.ConfirmWindow = class extends nettools.ui.desktop.dialogs.OkCancelWindow {
	
	/** 
	 * Constructor of CONFIRMWINDOW dialog
	 *
	 * @param string kind Window type (from nettools.ui.desktop.dialog consts : CONFIRM, RICHEDIT, DIALOG, DYNAMICFORM, CUSTOMDIALOG, PROMPT, TEXTAREA, NOTIFY)
	 */	 
	constructor(kind)
	{
		super(kind);
		
		this.lib = null;
	}
	
	
	
	/**
	 * Create dialog content
	 *
	 * @return string
	 */
	build()
	{
		return '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAppJREFUeNqkU0tPE1EY/e7M7UyBaZnCQKJAQVqDxMdCfBAjSuIDfMa4NHHFRl0aXejGR9yZkGiMO6OGH+BCFJWFLMREEiNKxAgmUNu0lFLaQimlnZnrd6dTGNbe5LR37nfOud+ce4cwxuB/BrV+dr8BEEQAIlAg5AAunUUEETU2bxHxBzEIjI0BM3UwDdAnzpQM7KECsOstjeqpgx1Nfq2mqlqWqMwL+by+Np/MZsa+hU/8jaSHcKkfkV7vAIcbXW91dbZe3NlW3xqNJoRHd7c4O5VvP1msV48EtYlfc+qXryFufId7C6W6ebwtqPUEW9RAPJ4SdN2AxwOTFt59ilmMYIMAyWRaCLR4A9ua1B6u2ejANHp3tdf7Y7EFUg51cLQI2ewKHN6zCHUVUZiaTsP4eAYopUTz1fpnZo1eTrMMmKEHJAreVKEAfPd0Jgu51VXo2OGGSyc1mJzJwauRHAgYiYn8YrHg5RpHBzou6pDLFyGznAcTWUSkcO+K3yo/eBEHKivrgZjgsjROg5n5hZXllYKoilIViDbx/I2Q9S9V+jadfT6/tsw1fF4K0TCGfv+MhD1elUluD3AQIsDo870W+Ly87pIVFg8vhLnG2cHwXCTWXaEoytbWYLOBN8p5Q6lUiUIPvpppRqanQulEYhhfcpjXrNTF5mf8JHyY5s1qre50Y1t7g+LTPC7ZLeP260Y/Pn74vpRMvMWAHuLNTRmhvpIBQRLxngOi9FDcphMv1QXkb0fU8k24uPvytUMjA08/g0iPsux7nS29BktbNigPIuEn4ApsJMZMEUjjMWzzvvWce9nJSvltMiB2Hi4eug3ZhsuC2LUPhP1Xodjfh88pRBK1OaeBYEO0QR3zco3zDH6SvBfUFv8JMAAv8hiRfYAaWQAAAABJRU5ErkJggg==" height="16" width="16" align="absmiddle"> <span class="uiPromptLib"></span>';
	}
	
	
	
	/**
	 * Create dialog	 
	 */
	create()
	{
		super.create();


		// detect key created HTML elements
		this.lib = this.node.querySelector('span.uiPromptLib'); 
	}
	
	
	
	/**
	 * Execute dialog with appropriate windows
	 *
	 * @param string lib Message
	 * @param function() cb Callback called when user clicks on OK button
	 * @param int w Dialog width ; if set, the dialog is centered ; if not set, default width used
	 * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered ; if not set, anchored to 10em top
	 * @param function() cbcancel Callback called when user clicks on CANCEL button
	 */
	execute(lib, cb, w, h, cbcancel)
	{
		this.lib.innerHTML = lib;

		// center
		this.center(w, (h!=nettools.ui.desktop.dialog.ALIGN_DEFAULT)?h:nettools.ui.desktop.dialog.ALIGN_TOP);


		// ok button
		this.setButtonsEvents(cb, null, cbcancel);

		
		// set window visible and focus on OK button
		this.show();
		this.ok.focus();
	}
}






nettools.ui.desktop.dialogs.NotifyWindow = class extends nettools.ui.desktop.dialogs.ConfirmWindow {
	
	/**
	 * Create dialog content
	 *
	 * @return string
	 */
	build()
	{
		return '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAjBJREFUeNqkk0trE1EUx8/cO49OfGTSRNJMYsA0aVonoYh13YW71uJCKFQhKqibfgFLwYULsR/AhY+VG1d+C124kJiFIGipmoIZNUXtZDKTycz1njGpaRNU8MJv7txzzv/c5xEYY/A/TRQEAW5c5KwM+aKcR73/a5zvg84HT371wv07Apwuj0x+PZW/vArA4NO7x/f4+OGoIHLKAAiC/fBdHadSbCGZPTeTzC7OUElbQNvBOISMMnIqeqFSYs57mTkfZD1/qYS2f0rAZ5pVDmXnY/FSbn3jM6xvfAEtfjKnRDLz6BtK4PPPADi+ms6vGK71lti2DUintUVSJ84b6OvF7GlI4PNMPVgAZ49oxpyqRnXf+wGWZYX4ngWRiKYfPpqfw5hBjej7eweqCkSo6JOLhmd/hI7vQLVaBdM0YXt1FgK2CeJ40fCbmxUWsGc8vh3egtcFQPhyLsQnzpQJcbVmuw5mawtqtRo0Gg3wJQeY7ALIrqZEM2WM7esIPkROAgR5OZEpTTV3X4IXNEGiLnw1b4fItBNCBQuiqeQUA7qMGtSSLt8C38aVRLo47QVvVJFYoFAnJJG8FdIfI6rSVWMTx6ZRg1rS7UKeSspSMj2Wk+AbjPGZ+vTboA1JZbQcEcUl1Iq2zdZyxURBpruUMTzR38Vl79wM+9bO0/3vlwLVs+OF16/MNdFug/vi+Xadm+vDL/3uHyuR16Er4E3gKvEaOTLa/1LBuEQPF8hxfgowAINnMqTBUH7hAAAAAElFTkSuQmCC" height="16" width="16" align="absmiddle"> <span class="uiPromptLib"></span>';
	}
	
	
	
	/**
	 * Create dialog	 
	 */
	create()
	{
		super.create();


		// no cancel button needed
		this.cancel.style.visibility = 'hidden';
		this.cancel.style.display = 'none';
	}
	
	
	
	/**
	 * Execute dialow with appropriate parameters
	 *
	 * @param string lib Message
	 * @param function() cb Callback called when user clicks on OK button
	 * @param int w Dialog width ; if set, the dialog is centered ; if not set, default width used
	 * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered ; if not set, anchored to 10em top
	 */
	execute(lib, cb, w, h)
	{
		super.execute(lib, cb, w, h, null);
	}	
}






nettools.ui.desktop.dialogs.PromptWindow = class extends nettools.ui.desktop.dialogs.OkCancelWindow {
	
	/** 
	 * Constructor of PROMPTWINDOW dialog
	 *
	 * @param string kind Window type (from nettools.ui.desktop.dialog consts : CONFIRM, RICHEDIT, DIALOG, DYNAMICFORM, CUSTOMDIALOG, PROMPT, TEXTAREA, NOTIFY)
	 */	 
	constructor(kind)
	{
		super(kind);
		
		this.lib = null;
		this.input = null;
		this.form = null;
	}
	
	
	
	/**
	 * Create dialog content
	 *
	 * @return string
	 */
	build()
	{
		return '<div class="uiPromptLib"></div><form><input type="text" name="value" class="uiPromptValue"></form>';
	}
	
	
	
	/**
	 * Create dialog	 
	 */
	create()
	{
		super.create();


		// detect key created HTML elements
		this.lib = this.node.querySelector('div.uiPromptLib'); 
		this.input = this.node.querySelector('input.uiPromptValue');
		this.form = this.node.querySelector('form');

		
		// add hidden submit
		this.constructor._addHiddenSubmit(this.form, this.ok);
	}
	
	
	
	/**
	 * Submit dialog inputs of custom dialog
	 *
	 * @param nettools.jscore.SubmitHandlers|function(string) cb Submit handler or callback called when the user clicks on OK button, with the value of the INPUT as only argument
	 */
	submitDialog(cb)
	{
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
		cb.submit(this.form, [this.input]);
	}

	
	
	/**
	 * Execute custom prompt window dialog with appropriate parameters
	 * 
	 * @param string lib Prompt string
	 * @param string defvalue Default value for prompt
	 * @param nettools.jscore.SubmitHandlers|function(string) cb Submit handler or callback called when the user clicks on OK button, with the value of the INPUT as only argument
	 * @param function() cbcancel Called when the user clicks on CANCEL button
	 */
	execute(lib, defvalue, cb, cbcancel)
	{
		// set lib and default value
		this.lib.innerHTML = lib;
		this.input.value = defvalue;


		// sizing
		this.center(nettools.ui.desktop.dialog.ALIGN_DEFAULT, nettools.ui.desktop.dialog.ALIGN_TOP);


		// set button events
		this.setButtonsEvents(cb, null, cbcancel);


		// dialog window visible and focus set on input
		this.show();
		this.input.focus();
	}
}


	

	
		

nettools.ui.desktop.dialogs.TextAreaWindow = class extends nettools.ui.desktop.dialogs.PromptWindow {
		
	/**
	 * Create dialog content
	 *
	 * @return string
	 */
	build()
	{
		return '<div class="uiTextAreaLib"></div><form><textarea class="uiTextAreaValue"></textarea></form>';
	}
	
	
	
	/**
	 * Create dialog	 
	 */
	create()
	{
		super.create();


		// redetect key created HTML elements (form has been already detected in SUPER call to PromptWindow 'create' method, but lib and input are wrong)
		this.lib = this.node.querySelector('div.uiTextAreaLib'); 
		this.input = this.node.querySelector('textarea');
	}


	
	/**
	 * Execute custom prompt window with appropriate parameters
	 * 
	 * @param string lib Prompt string
	 * @param string defvalue Default value for prompt
	 * @param nettools.jscore.SubmitHandlers|function(string) cb Submit handler or callback called when the user clicks on OK button, with the value of the INPUT as only argument
	 * @param string textareacssclass Makes it possible to apply a custom style to textarea (so that proper CSS width/height/format can be applied)
	 * @param function() cbcancel Called when the user clicks on CANCEL button
	 */
	execute(lib, defvalue, cb, textareacssclass, cbcancel)
	{
		// set lib and default value
		this.lib.innerHTML = lib;
		this.input.value = defvalue;

		this.input.className = 'uiPromptValue ' + textareacssclass;


		// sizing
		this.center(nettools.ui.desktop.dialog.ALIGN_DEFAULT, nettools.ui.desktop.dialog.ALIGN_CENTER);


		// set button events
		this.setButtonsEvents(cb, null, cbcancel);
		

		// dialog window visible and focus set on input
		this.show();
		this.input.focus();
	}
}


	
	
		

nettools.ui.desktop.dialogs.DynamicFormWindow = class extends nettools.ui.desktop.dialogs.OkCancelWindow {
	
	/** 
	 * Constructor of DYNAMICFORMWINDOW dialog
	 *
	 * @param string kind Window type (from nettools.ui.desktop.dialog consts : CONFIRM, RICHEDIT, DIALOG, DYNAMICFORM, CUSTOMDIALOG, PROMPT, TEXTAREA, NOTIFY)
	 */	 
	constructor(kind)
	{
		super(kind);
		
		this.form = null;
	}
	
	
	
	/**
	 * Create dialog content
	 *
	 * @return string
	 */
	build()
	{
		return '<form></form>';
	}
	
	
	
	/**
	 * Create dialog	 
	 */
	create()
	{
		super.create();


		// detect key created HTML elements
		this.form = this.node.querySelector('form');
	}
	
	
	
	/**
	 * Execute dialog window with dynamically created fields
	 *
	 * @param object params Object litteral describing fields (see nettools.ui.FormBuilder)
	 * @param string formClassName CSS style to apply to form
	 * @param int w Dialog width ; if set, the dialog is centered
	 * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered ; if not set, dialog is centered (no height set)
	 * @param function(HTMLFormElement, HTMLInputElement[]) onload Callback called when dialog window is ready
	 */
	execute(params, formClassName, w, h, onload)
	{
		// set target container form nettools.ui.FormBuilder
		params.target = this.form;


		// empty form, because it may have been used before
		params.target.innerHTML = "";
		var btns = this.node.querySelector('div.uiDialogButtons');
		if ( btns )
			btns.parentNode.removeChild(btns);


		// init css
		params.target.className = 'uiForm';
		if ( formClassName )
			formClassName.split(/ /).forEach(function(v){ params.target.classList.add(v); });


		// add more processing to SUBMIT and CANCEL handlers
		var that = this;
		params.submit = nettools.jscore.SubmitHandlers.Callback.toSubmitHandler(params['submit']).customEvent(
			function(form, elements)
			{
				that.hide();
			});


		var cbcancel = params.cancel;
		params.cancel = function(form)
			{
				if ( typeof cbcancel === 'function' )
					cbcancel(form);					

				that.hide(); 
			};


		// create form thanks to nettools.ui.FormBuilder ; form is created inside params.target node
		nettools.ui.FormBuilder.createForm(params);


		// centering and styling
		this.center(w, h);
		params.target.firstChild.style.marginTop = '0px';


		// move buttons DIV outside form
		var btns = params.target.querySelector('.FormBuilderButtons');
		btns.className = 'uiDialogButtons';
		this.node.appendChild(btns);
		btns.insertBefore(document.createTextNode('\u00A0\u00A0\u00A0'), btns.lastChild);


		// add form 'onsubmit' event on SUBMIT button since we are outside the form, auto-submit can't work
		btns.firstChild.onclick = params.target.onsubmit;


		// add hidden submit inside form, so that ENTER key submit works
		nettools.ui.desktop.dialogs.OkCancelWindow._addHiddenSubmit(params.target, btns.firstChild);


		// add ESCAPE key behavior
		nettools.ui.desktop.InputHelper.escapeBehavior(params.target, params.cancel);
		
		
		// dialog window is now visible
		this.show();


		// set focus to first field
		if ( params.target.elements[0].focus )
			params.target.elements[0].focus();


		// custom onload event 
		if ( typeof onload == 'function' )
			onload(params.target, params.target.elements);
	}
}




	
	
		

nettools.ui.desktop.dialogs.RichEditWindow = class extends nettools.ui.desktop.dialogs.OkCancelWindow {
	
	/** 
	 * Constructor of RICHEDITWINDOW dialog
	 *
	 * @param string kind Window type (from nettools.ui.desktop.dialog consts : CONFIRM, RICHEDIT, DIALOG, DYNAMICFORM, CUSTOMDIALOG, PROMPT, TEXTAREA, NOTIFY)
	 */	 
	constructor(kind)
	{
		super(kind);
		
		this.textarea = null;
		this.editor = null;
	}
	
	
	
	/**
	 * Create dialog content
	 *
	 * @return string
	 */
	build()
	{
		return '<form><textarea style="visibility:hidden;" name="dialog_rte"></textarea></form>';
	}
	
	
	
	/**
	 * Create dialog	 
	 */
	create()
	{
		super.create();


		// detect key created HTML elements
		this.textarea = this.node.querySelector('textarea');
	}
	
	
	
	/**
	 * Cancel dialog
	 *
	 * @param function() cbcancel Callback called when user clicks on CANCEL button ; null may be used if no reaction to dialog cancelation is required
	 */
	cancelDialog(cbcancel)
	{
		// remove editor
		try { this.editor.remove(); this.editor = null; } catch (e){}
		
		super.cancelDialog(cbcancel);
	}
	
	
	
	/**
	 * Submit dialog richedit input
	 *
	 * @param function(string) cb Callback called to submit data in Richedit editor
	 */
	submitDialog(cb)
	{
		var value = this.editor.getContent();
		
		// remove editor
		try { this.editor.remove(); this.editor = null; } catch (e){}
		
		// callback with value
		if ( cb && (typeof cb === 'function') )
			cb(value);
	}

	
	
	/**
	 * Execute Richedit dialog with appropriate parameters
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
	execute(def, w, h, cb, cbcancel)
	{
		// add setup for i18n
		function _i18n(params)
		{
			if ( nettools.ui.desktop.dialog.i18n.TINYMCE_LANGUAGE != 'en' )
			{
				params.language = nettools.ui.desktop.dialog.i18n.TINYMCE_LANGUAGE;
				params.language_url = nettools.ui.desktop.dialog.i18n.TINYMCE_LANGUAGE_URL;
			}
			
			return params;
		}
		
		
		
		if ( !window.tinymce )
		{
			nettools.ui.desktop.dialog.prompt('TINYMCE missing !', def, cb, true);
			return;
		}


		// CSS reset
		this.node.classList.remove('uiDialogVCentered');
		this.node.classList.remove('uiDialogTopAligned');
		this.node.classList.remove('uiRichEditFrameWMax');
		this.node.style.width = null;


		// - set width or center with max width
		if ( !w )
			this.node.className += ' uiRichEditFrameWMax';
		else
			this.node.style.width = new nettools.ui.Size(w).toString();


		// - set height 
		var hObject = new nettools.ui.Size(h);

		if ( hObject.isNull() || hObject.isPositive() || (hObject.unit != 'px') )
			this.node.className += ' uiDialogVCentered';


		// if H negative and unit is 'px', set height to abs(H) and anchor to 10em top
		if ( hObject.isNegative() && (hObject.unit == 'px') )
		{
			this.node.className += ' uiDialogTopAligned';
			hObject = hObject.negate();
		}


		// si other unit than PX
		if ( hObject.unit != 'px' )
			hObject = new nettools.ui.Size(null);


		// content
		this.textarea.value = def;


		var that = this;
		tinymce.init(_i18n({
			/* textarea */
			target: this.textarea,

			/* height for editable field */
			height:(hObject.isNull() ? (window.innerHeight - 140) : hObject.size) + 'px',

			/* URL handling : do not rewrite them */
			remove_script_host : false,
			relative_urls : false,

			/* plugins */
			plugins: "lists advlist anchor autolink charmap code fullscreen link nonbreaking paste print preview quickbars searchreplace visualblocks visualchars",				

			/* toolbar */
			toolbar: 'undo redo | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | outdent indent bullist numlist | preview code | charmap nonbreaking'
		})).then(function(editors){
			
			that.editor = editors[0];
			
			// set buttons events
			that.setButtonsEvents(
				
				// cb
				cb,
							  
				
				// cbv
				null, 
								  
								  
				// cbcancel
				cbcancel
			);			
		});



		// set the dialog window visible
		this.show();
	}
}








nettools.ui.desktop.dialog = nettools.ui.desktop.dialog || (function(){

	// ---- PRIVATE ----
	
	const CONFIRM = "Confirm";
	const RICHEDIT = "RichEdit";
	const DIALOG = "Dialog";
	const DYNAMICFORM = "DynamicForm";
	const CUSTOMDIALOG = "CustomDialog";
	const PROMPT = "Prompt";
	const TEXTAREA = "TextArea";
	const NOTIFY = "Notify";

	
	
	// cache of created content
	var _divs = {};


	
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


	
	// create dialog node
	function _createContent(div)
	{
		// select class constructor
		var construct = nettools.ui.desktop.dialogs[div + 'Window'];
		if ( !construct )
			throw new Error(`Class constructor '${div}' for dialog window not found`);
		
		return new construct(div).prepare();
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
         * Richedit with Promise resolved with the richedit content when users clicks on OK button
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
         * Richedit 
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
			_get(RICHEDIT).execute(def, w, h, cb, cbcancel);
		},	
		
		
		
		// ---- NOTIFY -----	
		
		/**
         * Notify window with Promise, resolved when user clicks on OK button
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
			_get(NOTIFY).execute(lib, cb, w, h);
		},
		
		
	
		// ---- CONFIRM ----
	
		/**
         * Confirm window with Promise resolved if users clicks on OK button
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
			_get(CONFIRM).execute(lib, cb, w, h, cbcancel);
		},
		
	
	
		// ---- SHOW DIALOG ----
                
		/**
         * Display an iframe as dialog window and returns a Promise resolved with an object having 'form' and 'elements' properties
         * 
         * @param string src Path to iframe src
         * @param int w Dialog width ; if set, the dialog is centered
         * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered
         * @param function(HTMLDocument) cbv Callback called to validate inputs
         * @param bool showCancel May be set to TRUE to display CANCEL button
		 * @param string cssClass CSS classname to set for dialog window
         * @return Promise Returns a Promise resolved when users clicks on OK button, with a object litteral as value {HTMLFormElement form, HTMLInputElement[] elements}, rejected if CANCEL button clicked
         */
        showPromise : function(src, w, h, cbv, showCancel, cssClass)
        {
			return new Promise(
					function(resolve, reject)
					{
                        nettools.ui.desktop.dialog.show(src, w, h, function(f, e, d){resolve({form:f, elements:e});}, cbv, reject, showCancel, cssClass);
                    }
                );
        },
        
        
	
		/**
         * Display an iframe as dialog window 
         * 
         * @param string src Path to iframe src
         * @param int w Dialog width ; if set, the dialog is centered
         * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered
         * @param nettools.jscore.SubmitHandlers.Handler|function(HTMLForm, HTMLElements[]) cb Submit handler or callback called when user clicks on OK button
         * @param function(HTMLDocument) cbv Callback called to validate inputs
         * @param function() cbcancel Callback called when user clicks on CANCEL button
         * @param bool showCancel May be set to TRUE to display CANCEL button
		 * @param string cssClass CSS classname to set for dialog window
         */
		show : function(src, w, h, cb, cbv, cbcancel, showCancel, cssClass)
		{
			_get(DIALOG).execute(src, w, h, cb, cbv, cbcancel, showCancel, cssClass);
		},
		
        
		
		/**
         * Display an iframe as dialog window and submit it at the same address as POST request
         * 
         * @param string src Path to iframe src
         * @param int w Dialog width ; if set, the dialog is centered
         * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered
         * @param function(HTMLDocument) cbv Callback called to validate inputs
         * @param function() cbcancel Callback called when user clicks on CANCEL button
         * @param bool showCancel May be set to TRUE to display CANCEL button
		 * @param string cssClass CSS classname to set for dialog window
         */
		showAndSubmit : function (src, w, h, cbv, cbcancel, showCancel, cssClass)
		{
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
						cbcancel,
						showCancel,
											
											
						// css class
						cssClass
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
			_get(DYNAMICFORM).execute(params, formClassName, w, h, onload);
		},
	
	
				
		/**
         * Create a dialog window with dynamically created fields, returning a Promise resolved with 
         *
         * @param object params Object litteral describing fields (see nettools.ui.FormBuilder)
         * @param string formClassName CSS style to apply to form
         * @param int w Dialog width ; if set, the dialog is centered
         * @param int h Dialog height ; if negative, anchored to 10em top and height set to abs(height); if positive, height is set and dialog is centered ; if not set, dialog is centered (no height set)
         * @param function(HTMLFormElement, HTMLInputElement[]) onload Callback called when dialog window is ready
         */
		dynamicFormPromise : function (params, formClassName, w, h, onload)
		{
			return new Promise(
					function(resolve, reject)
					{
						params.submit = new nettools.jscore.SubmitHandlers.Callback({ 
							target : function(form, elements)
								{ 
									resolve({ form:form, elements:elements });
								} 
						});
						
						params.cancel = reject;
						
						
						nettools.ui.desktop.dialog.dynamicForm(params, formClassName, w, h, onload);
					}
				);
		},
	
	
				
		// ---- CUSTOM DIALOG ----
		
		/**
         * Custom dialog as HTML and returning a Promise resolved with the html node the dialog is built into
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
			_get(CUSTOMDIALOG).execute(html, w, h, cb, cbv, cbcancel, showCancel);
		},
		
				
		
		// ---- NOTIFY		
        
		/**
         * Custom notification window as HTML and returning a Promise resolved when user clicks on OK button
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
                // creating a DIV with css style 'uiNotifyFrame' so that we can get the width defined in the style
                var tmp = document.createElement('div');
                tmp.className = 'uiNotifyFrame';
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
         * Custom prompt window, returning a Promise resolved with the input field value when user clicks on OK button
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
			if ( textarea )
				_get(TEXTAREA).execute(lib, defvalue, cb, textareacssclass, cbcancel);
			else
				_get(PROMPT).execute(lib, defvalue, cb, cbcancel);
		}
	};
})();


// i18n
nettools.ui.desktop.dialog.i18n = {
	BUTTON_OK : ' OK ',
	BUTTON_CANCEL : 'Cancel',
	TINYMCE_LANGUAGE : 'en',
	TINYMCE_LANGUAGE_URL : 'undefined'
}

