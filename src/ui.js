// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name default.js
// @language_out ECMASCRIPT_2017
// ==/ClosureCompiler==


window.nettools = window.nettools || {};
nettools.ui = nettools.ui || {};




// ==== MENUS ====

nettools.ui.SimpleMenu = class {
	
	/**
	 * Menu constructor
	 *
	 * `options` object may define :
	 * - onCustomize : function(nettools.ui.SimpleMenu) ; a callback called before creating the menu, to update items according to context (for example, disabling lines, etc.)
	 * 
	 * `items` array of object litterals represents the menu items. Each object litteral may define :
	 * - id : string ; DOM id of item (not mandatory)
	 * - title : string ; this is the string displayed on screen for this menu item
	 * - disabled : bool
	 * - onclick : function(event) ; this is a event handler called when this menu item is clicked
	 * - url : { href : string, target : ''|'_blank', csrf : bool } ; object litteral describing link (target url, target window, CSRF handling enabled)
	 *
	 * @param object[] items Array of object litterals describing menu items
	 * @param object options Object litterals of parameters for this menu
	 */
	constructor(items = [], options = {})
	{
		this._items = items;
		this._options = options;
		this._node = null;
		
		this._options.onCustomize = this._options.onCustomize || null;
	}
	
	
	
	/**
	 * Static method to create a line item as an image
	 *
	 * @param string title Image title (will be displayed as tooltip over image)
	 * @param string img Path to image
	 * @return string Returns a string describing line item content as HTML formatting
	 */
	static image(img, title = '')
	{
		return `<img src="${img}" title="${title}">`;
	}
	
	
	
	/** 
	 * Get DOM node for menu
	 *
	 * @return HTMLElement
	 */
	get node() { return this._node; }
	
	
	
	/**
	 * Get menu items array (array of object litterals)
	 *
	 * @return object[]
	 */
	get items() { return this._items; }
	
	
	
	/**
	 * Set menu items array (array of object litterals)
	 *
	 * @param object[] items
	 */
	set items(items = [])
	{
		this._items = items;
		this.update();
	}
	
	
	
	/**
	 * Display menu on screen
	 */
	update()
	{
		// customize menu
		this.customize();
		
		// create menu nodes
		this.build();
	}
	
	
	
	/**
	 * Customize menu items before displaying menu (useful to disable some menu items depending on context)
	 */
	customize()
	{
		if ( typeof this._options.onCustomize === 'function' )
			this._options.onCustomize.call(this);
	}
	
	
	
	/**
	 * Customize HTML node created for one line
	 *
	 * @param HTMLLIElement node
	 * @param object item Object litteral describing the item line in menu
	 */
	customizeNode(node, item)
	{
		
	}
	
	
	
	/**
	 * Create menu items as HTML nodes
	 */
	build()
	{
		// removing menu from DOM if already created
		this.destroy();
		
		// create items nodes
		this.create();
	}
	
	
	
	/**
	 * Create items as HTML nodes (not added to DOM at the moment)
	 */
	create()
	{
		var __urlHandler = function(item){
				var url = item.url.href;

				// if csrf handling for link
				if ( item.url.csrf )
					url = nettools.jscore.SecureRequestHelper.addCSRFSubmittedValue(url);
			
				// popup or page location new value ?
				if ( item.url.target == '_blank' )	
					window.open(url, item.id);
				else
					document.location = url;
			}
		
		
		this._node = document.createElement('UL');
		this._node.classList.add('uiSimpleMenu');
		
		
		for ( var i = 0 ; i < this._items.length ; i++ )
		{
			// create 1 line in menu
			var item = this._items[i];
			var li = document.createElement('LI');
			li.menuObject = this;
			
			
			// if real menu item
			if ( item )
			{
				li.innerHTML = item.title || '';
				li.id = item.id || '';
				
				// if item disabled, set attribute
				if ( item.disabled )
					li.setAttribute('data-disabled', 'true');
				else
				{
					// if menu item is a link
					if ( item.url && item.url.href )
						li.addEventListener('click', __urlHandler.bind(li, item));

					// if menu item has a onclick event
					if ( item.onclick )
						li.addEventListener('click', item.onclick);
				}
			}
			else
			{
				// if no item details, this is a separator line
				li.setAttribute('data-separator', 'true');
			}
			
			
			// customize created li
			this.customizeNode(li, item);
			
			// add to parent menu node
			this._node.appendChild(li);
		}
	}	
	
	
	
	/**
	 * Remove menu from DOM
	 */
	destroy()
	{
		if ( this._node )
		{
			this._node.parentNode.removeChild(this._node);
			this._node = null;
		}
	}
}








nettools.ui.PopupMenu = class extends nettools.ui.SimpleMenu {
	
	/**
	 * Menu constructor for popup menu
	 *
	 * In addition to `options` description in nettools.ui.SimpleMenu, `options` object may define :
	 * - attachTo : HTMLElement ; a DOM tag that the popup menu is linked to, it will open when the user right-click on the target
	 * 
	 * @param object[] items Array of object litterals describing menu items
	 * @param object options Object litterals of parameters for this menu
	 */
	constructor(items = [], options = {})
	{
		super(items, options);
		
		// no current target
		this.target = null;
		
		// attaching popup to a single DOM element now ?
		if ( this._options.attachTo )
			this.attach(this._options.attachTo);
	}
	
	
	
	/**
	 * React to onContextMenu event ; THIS is bound to popup menu object
	 *
	 * @param Event event
	 */
	onPopupEvent(event)
	{
		// popup a coordinates, relative to parent node
		this.popup(event.target, event.offsetX, event.offsetY);
		
		// no OS context menu
		event.preventDefault();
	}
	
	
	
	/**
	 * Attach popup menu to a HTMLElement
	 *
	 * @param HTMLElement|HTMLElement[] node Array of nodes or single node to attach popup menu to
	 */
	attach(node)
	{
		if ( (node.constructor.name != 'Array') && (node.constructor.name != 'NodeList') )
			node = [node];
		
		var that = this;
		node.forEach(function(n){
			n.addEventListener('contextmenu', that.onPopupEvent.bind(that));
			n.classList.add('uiSimpleMenuTarget');
		});
	}
	
	
	
	/**
	 * React to mouse leaving popupmenu ; THIS is bound to popup menu object
	 *
	 * @param Event event
	 */
	onMouseLeave(event)
	{
		this.target = null;
		this.destroy();
	}
	
	
	
	/**
	 * Create popup menu in DOM
	 */
	create()
	{
		super.create();
		
		// adding event listerner for mouse leaving
		this._node.addEventListener('mouseleave', this.onMouseLeave.bind(this));
				
		// add event listener for onclick events on UL node, the click event on LI will bubble up to parent node, since the event propagation is not stopped
		this._node.addEventListener('click', this.onMouseLeave.bind(this));
	}
	
	
	
	/**
	 * Display popup menu on top of a DOM target node
	 *
	 * @param HTMLElement target The popupmenu will show on top of this element, at coordinates x,y from target top left corner
	 * @param int x
	 * @param int y
	 */	 
	popup(target, x, y)
	{
		this.target = target;
		this.update();
		
		this._node.style.left = x-2 + 'px';
		this._node.style.top = y-2 + 'px';
		target.appendChild(this._node);
	}
}







nettools.ui.FloatingMenu = class extends nettools.ui.SimpleMenu {
	
	/**
	 * Menu constructor for floating menu, always anchored to coordinates
	 *
	 * In addition to `options` description in nettools.ui.SimpleMenu, `options` object may define :
	 * - attachTo : HTMLElement ; a DOM tag that the floating menu is linked to
	 * - position : int ; an int from nettools.ui.FloatingMenu.TOP_LEFT|TOP_RIGHT|BOTTOM_LEFT|BOTTOM_RIGHT defining floating menu position
	 * 
	 * @param object[] items Array of object litterals describing menu items
	 * @param object options Object litterals of parameters for this menu
	 */
	constructor(items = [], options = {})
	{
		super(items, options);
		
		
		// attaching popup to a single DOM element now ?
		if ( this._options.attachTo )
			this.attach(this._options.attachTo);
	}
	
	
	
	/**
	 * Attach menu to a HTMLElement
	 *
	 * @param HTMLElement node Node to attach floating menu to
	 */
	attach(node)
	{
		node.classList.add('uiSimpleMenuTarget');
		this.show(node);
	}
	
	
	
	/**
	 * Display floating menu on top of a DOM node
	 *
	 * @param HTMLElement node Node to insert the floating menu node into
	 */	 
	show(node)
	{
		this.update();
		
		switch ( this._options.position )
		{
			case nettools.ui.FloatingMenu.TOP_LEFT:
				this._node.style.left = 0;
				this._node.style.top = 0;
				break;
				
			case nettools.ui.FloatingMenu.BOTTOM_LEFT:
				this._node.style.left = 0;
				this._node.style.bottom = 0;
				break;
				
			case nettools.ui.FloatingMenu.BOTTOM_RIGHT:
				this._node.style.right = 0;
				this._node.style.bottom = 0;
				break;
				
			case nettools.ui.FloatingMenu.TOP_RIGHT:
			default:
				this._node.style.right = 0;
				this._node.style.top = 0;
				break;
		}
		
		node.appendChild(this._node);
	}
}


nettools.ui.FloatingMenu.TOP_LEFT = 1;
nettools.ui.FloatingMenu.TOP_RIGHT = 2;
nettools.ui.FloatingMenu.BOTTOM_LEFT = 3;
nettools.ui.FloatingMenu.BOTTOM_RIGHT = 4;	







// ==== REQUEST FEEDBACK UI ====

nettools.ui.RequestFeedback = class extends nettools.jscore.RequestFeedback{
    
    /**
     * Display request upload feedback on screen with a simple percentage UI
     *
	 * @param object params Parameters as object litteral
	 * @param function(int) onfeedback User callback called to notify the upload progress with an int as parameter (percentage done 0..100)
	 * @param function() onload User callback called when upload is done
	 * @param function() onabort User callback called if upload is aborted or if an error occured
	 *
	 * 'params' object litteral may include :
     * {
     *    HTMLDocument context : document context to create HTML tags into
     *    string loadmsg : may contain any 'upload done' message to display
     * }
	 */
    constructor(params, onfeedback, onload, onabort)
    {
		super(onfeedback, onload, onabort);
		
		
		params = params || {};
        this.context = params['context'] || document;
        this.loadMessage = params['loadmsg'];
		
		this.node = null;
	}
	


    /**
     * Display upload progress in GUI
     *
     * @param int pct
     */
    feedback(pct)
    {
        // create UI if not already done
        this.createFeedbackUI();

		
        // update pct
		if ( this.node.firstChild )
        	this.node.firstChild.innerHTML = pct + '%';


		// parent call
		super.feedback(pct);
    }



    /**
     * Cancel request
     */
    abort()
    {
        this.hideFeedbackUI();
        alert(nettools.ui.RequestFeedback.i18n.ABORT_MSG);

		
		// parent call
		super.abort();
    }



    /**
     * React to upload end (this is not an "answer received" event !)
     */
    load()
    {
        this.hideFeedbackUI();
        if ( this.loadMessage )
            alert(this.loadMessage);


		// parent call
		super.load();
    }



    /**
     * Creating UI
     */
    createFeedbackUI()
    {
        // if not already created
		if ( !this.node )
		{
			this.node = this.context.createElement('div');
			this.node.className = 'uiRequestFeedback';
			this.node.innerHTML = '<span></span>';

			this.context.body.insertBefore(this.node, this.context.body.firstChild);
		}
    }



    /**
     * Hide UI
     */
    hideFeedbackUI()
    {		
        if ( this.node )
		{
            this.node.parentNode.removeChild(this.node);
			this.node = null;
		}
    }
}



// i18n
nettools.ui.RequestFeedback.i18n = {
	ABORT_MSG : 'An error occured during request data upload'
}








// ==== SIZE ====
	
nettools.ui.Size = class {
	
	/** 
	 * Size object constructor : handle sizes (arithmetics) and preserve unit
	 *
	 * @param int|string|nettools.ui.Size s Size (as a string, an int, or a Size object to clone) ; if no unit given, we assume it's 'px'
	 */
	constructor(s)
	{
		if ( s == null )
		{
			this.size = null;
			this.unit = null;
			return;
		}


		// si clone
		if ( s instanceof nettools.ui.Size )
		{
			this.size = s.size;
			this.unit = s.unit;
			return;
		}


		// cas général
		var regs = null;
		if ( regs = (s).toString().match(/^([0-9]+)([a-z]+)$/) )
		{
			this.size = parseInt(regs[1]);
			this.unit = String(regs[2]);
		}
		else
		{
			this.size = parseInt(s);
			this.unit = 'px';
		}
	}



	/** 
	 * Does the size exists (not null) ?
	 *
	 * @return bool
	 */
	isNull()
	{
		return (this.size == null);
	}



	/** 
	 * Is size positive ?
	 *
	 * @return bool 
	 */
	isPositive()
	{
		return (this.size >= 0 );
	}



	/** 
	 * Is size negative ?
	 *
	 * @return bool 
	 */
	isNegative()
	{
		return (this.size < 0 );
	}



	/**
	 * Negate the size sign (eg. 5px becomes -5px)
	 *
	 * @return Size Returns a new Size object
	 */
	negate()
	{
		if ( this.isNull() )
			return new nettools.ui.Size(null);

		return new nettools.ui.Size((-this.size) + this.unit);
	}



	/**
	 * Get the absolute value of size (eg. -5px becomes 5px ; 5px stays 5px)
	 *
	 * @return Size Returns a new Size object
	 */
	abs()
	{
		if ( this.isNull() )
			return new nettools.ui.Size(null);

		return new nettools.ui.Size(Math.abs(this.size) + this.unit);
	}



	/**
	 * Convert the Size object to a string (size with unit appended)
	 *
	 * @return string
	 */
	toString()
	{
		if ( this.isNull() )
			return '';

		return this.size + this.unit;
	}



	/**
	 * Add a value to a Size object
	 * 
	 * @param int|nettools.jscore.Size value Value to add to object, as an int or a Size object
	 * @return Size Returns a new Size object where its size property has been incremented with value parameter
	 */
	add(value)
	{
		if ( this.isNull() )
			return new nettools.ui.Size(null);


		// if adding 2 objects
		if ( value instanceof nettools.ui.Size )
			// only possible if same unit
			if ( this.unit === value.unit )
				return new nettools.ui.Size(this.size + value.size + this.unit);
			else
				throw new Error('Cannot add a Size object to another with different units');
		else
			return new nettools.ui.Size(this.size + Number(value) + this.unit);
	}



	/**
	 * Subtract a value from a Size object
	 * 
	 * @param int|nettools.jscore.Size value Value to subtract from an object, as an int or a Size object 
	 * @return Size Returns a new Size object where its size property has been decremented with value parameter
	 */
	subtract(value)
	{
		if ( this.isNull() )
			return new nettools.ui.Size(null);


		// if dealing with 2 objects
		if ( value instanceof nettools.ui.Size )
			// only possibile if same unit
			if ( this.unit === value.unit )
				return new nettools.ui.Size(this.size - value.size + this.unit);
			else
				throw new Error('Cannot subtract a Size object from another with different units');
		else
			return new nettools.ui.Size(this.size - Number(value) + this.unit);
	}
}








// ==== FORM BUILDER ====

/**
 * Create forms on the fly 
 *
 * `params` object litteral argument may define those properties :
 *   - notice : string ; a string that will be displayed as first line
 *   - fields : object ; an object litteral, each key defining a field (see below for allowed values)
 *   - onsubmit : function(HTMLInputElement[]) ; a custom function to validate data before sending form ; must return an object litteral { status:true/false, message:'', field:input_in_error}
 *   - onsubmitpromise : function(HTMLInputElement[]) ; a custom function to validate data before sending form ; must return a Promise resolved with value {status:true} or a rejected promise with value { status:false, message:'', field:input_in_error}
 *   - presubmit : function(HTMLInputElement[]) ; a custom function to make any updates to data before validation and submission (may be used to remove unwanted characters, etc.)
 *   - submit : nettools.jscore.SubmitHandlers.Handler ; an object responsible for handling form submission
 *   - cancel : function(HTMLForm) ; a callback called if form is canceled
 *   - target : HTMLForm ; form node to create field into, if not defined, a new form will be created
 *   - name : string ; form name
 *   - required : string[] ; defines mandatory fields as an array of string, each values being a key of `fields` object litteral property
 *   - regexps : object ; an object litteral defining regular expressions to validate fields, as a couple (key,value), key being the field key as in `fields` object litteral property, value being a RegExp object
 *   - notifier : function({status:true/false, message:'', field:input}) ; defines a custom notification function to alert the user when form values are invalid 
 *
 * `params.fields` property is an object litteral whose keys are fields names and values another object litteral describing the field. Here are samples of field definitions
 *  {
 *  	name1 : {type:'text/tel/number/email', value:'val1', label:'label1', required:true, regexp:/.../, style:'width:200px;', newLineAfterLabel:true}, 
 *  	name2 : {type:'select', value:'sel2', options:[ {value:'sel1', label:'labelsel1', className:'optclass'},...]},
 *  	name2 : {type:'select', value:'sel2', options:[ 'selA', 'selB', ...]},
 *  	name3 : {type:'text', value:'', newLineBefore:false, nolabel:true, required:true, placeholder:'2 letters', title:'Help here', className:'css'},
 *  	name4 : {type:'checkbox', value:'1', label:'labcb', checked:true, newLineBefore:true},
 *  	name5 : {type:'radio', items:[{name:'r1', label:'radio1', value:'val1', checked:true}, {name:'r2', value:'val2', label:'radio2'}]},
 *  	name6 : {type:'hidden', value:'hidden'},
 *  	name7 : {type:'textarea', value:'', newLineBefore:true, regexp:/abcd/},
 *  	name8 : {type:'file', value:'', newLineBefore:true},
 *  	name9 : {type:'image', value:'images/pic.jpg', label : 'Logo actif', title:'Image tooltip here'},
 *		name10: {type:'date', value:'2018-10-25'},
 *		name11: {type:'text', value:'tmp', readonly:true},
 *      name12: {type:'text', value:'xxx', autocomplete:true, options:[{value:'sel1', label:'labelsel1'}, ... ], listWidth:'16em', onchange:function(value, label){this = input} },
 *      name13: {type:'text', value:'yyy', onchange:function(){this = input}}
 *  }
 */ 
nettools.ui.FormBuilder = (function(){
	
	// ---- PRIVATE ----	
	
	function __preventDefault(event)
	{
		event.preventDefault();
	}
	
	
	
	/** 
	 * Create field label
	 *
	 * @param string name
	 * @param string id
	 * @param object field Field definition (a value of `fields` object litteral parameter)
	 * @param bool after Is the label after or before the field ?
	 * @return HTMLLabelElement
	 */
	function _createLabel(name, id, field, after)
	{
		var label = document.createElement('label');
		label.innerHTML = (after ? ' ' : '') + nettools.jscore.firstUpperCase(field['label'] ? field.label : name) + (after ? '' : ' : ');
		label.style.verticalAlign = 'top';
		
		if ( id )
			label.setAttribute('for', id);

		// if newline after label
		if ( field['newLineAfterLabel'] )
			label.innerHTML = label.innerHTML + '<br>';

		return label;
	}
	
	
	
	/**
	 * Creating a field
	 *
	 * @param object field Field definition (a value of `fields` object litteral parameter)
	 * @param string name Field name (key of `fields` object litteral parameter)
	 * @param object params Object litteral describing dynamic form : pass the `params` parameter of `createForm` function
	 * @return HTMLElement Returns a node with created field/label
	 */
	function _createField (field, name, params)
	{
		// no field type ? assume it's `text`
		if ( (field['type'] === null) || (field['type'] === undefined) )
			field.type = 'text';
		
			
		// create line content
		var div = document.createElement('span');
		div.className = "FormBuilderField";
		
					
		// create label before field (except for checkboxes and radio buttons, or if 'nolabel' flag
		var unid = name + nettools.jscore.randomNumber();
		if ( (field.type !== 'checkbox') && (field.type !== 'radio') && ((field['nolabel'] === undefined) || !field.nolabel) )
			div.appendChild(_createLabel(name, unid, field));
		
		
		// create field
		switch ( field.type )
		{
			// type is 'select'
			case "select" :
				var e = document.createElement('select');
				
				// create list items provided in 'options' property
				var opt = field['options'] || [];
				var optl = opt.length;
				for ( var i = 0 ; i < optl ; i++ )
				{
					// if label AND value are defined
					if ( typeof opt[i] === 'object' )
						e.options[i] = new Option(opt[i].label || opt[i].value, opt[i].value);
					else
						e.options[i] = new Option(opt[i], opt[i]);
					
					// if custom style on a row of the list, apply classname
					if ( opt[i].className )
						e.options[i].className = opt[i].className;
				}
					
				break;
				
				
			// textarea
			case "textarea" :
				var e = document.createElement('textarea');
				break;
				
				
			// image
			case "image" :
				var e = document.createElement('img');
				e.src = field.value;
				break;
				
				
			// general case
			case "text" :
			default:
				var e = document.createElement('input');
				e.type = field.type;
		}
		

		
		// no issue properties
		e.name = name;
		e.id = unid;
		e.setAttribute('data-formBuilderType', e.type);
		
		
		if ( field['label'] )
			e.title = field.label;

		if ( field['title'] )	
			e.title = field.title;	// we prefer 'title' property than the 'label' property
			
		if ( field['placeholder'] )
			e.placeholder = field.placeholder;
		
		if ( field['readonly'] )
			if ( field.type != 'text' )
			{
				e.onmousedown = __preventDefault;
				e.setAttribute('readonly', 'readonly');
			}
			else
				e.readOnly = field['readonly'];
		
		
		
		// if browser is NOT html5 compliant, the type is reverted to 'text'
		if ( (field.type === 'date') && (e.type == 'text') )
			// in that case, forcing regexp for this field to normalized format for 'date' field : yyyy-mm-dd
			field['regexp'] = /^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
				
		
		
		// set value now because field type may have been changed before (such as with 'date' fields if dhtmlx-calendar loaded)
		// and if we set a value not allowed (invalid format) for a 'date' field, the value will be blank
		if ( field.type !== 'image' )
			e.value = (field['value'] !== undefined) ? field.value : '';
		

		
		// field validation : required / regular expression
		params.required = params['required'] || [];
		params.regexps = params['regexps'] || {};
		if ( field['required'] )
			params.required.push(name);

		if ( field['regexp'] )
			params.regexps[name] = field.regexp;
		
		
		
		// html5 attributes 
		if ( params.required.indexOf(name) != -1 )
			e.required = true;
		if ( params.regexps[name] )
		{
			e.pattern = params.regexps[name].source;
			
			
			// set title so that html5 validation may display correct strings
			switch ( e.getAttribute('data-formBuilderType') )
			{
				case 'email' : e.title = nettools.ui.FormBuilder.i18n.PATTERN_EMAIL; break;
				case 'date' : e.title = nettools.ui.FormBuilder.i18n.PATTERN_DATE; break;
				case 'tel' : e.title = nettools.ui.FormBuilder.i18n.PATTERN_TEL; break;
				case 'number' : e.title = nettools.ui.FormBuilder.i18n.PATTERN_NUMBER; break;
			}
			
		}
		
		
		// css class ?
		if ( field['className'] )
			e.className = field.className;
		
		
		// css style
		if ( field['style'] )
		{
			var styles = field.style.split(";");
			for ( var s = 0 ; s < styles.length ; s++ )
				// ignore last value
				if ( nettools.jscore.trim(styles[s]) !== '' )
				{
					var st = styles[s].split(':');
					var sty = nettools.jscore.trim(st[0]);
					
					// if composed property, capitalize first letter
					var p = sty.indexOf('-');
					if ( p != -1 )
						sty = sty.substring(0, p) + sty.substr(p + 1, 1).toUpperCase() + sty.substr(p+2);
					
					// set style
					e.style[sty] = nettools.jscore.trim(st[1]);
				}
		}

		
		// add created field to form
		div.appendChild(e);

		
		// if checkbox or radio button, set 'checked' property
		if ( (e.type === 'checkbox') || (e.type === 'radio') )
		{
			e.checked = field['checked'];
			
			// maybe append label AFTER field
			if ( !field['nolabel'] )
				div.appendChild(_createLabel(name, unid, field, true));
		}
		

		// if hidden, set style required to hide the field
		if ( e.type === 'hidden' )
		{
			div.style.visibility = "hidden";
			div.style.display = "none";
		}
		
		
		// si liste de choix autocomplete
		if ( field['autocomplete'] )
		{
			// autocomplete clients
			new Awesomplete(e, {
					list : field['options'] || [],
					tabSelect : true,
					autoFirst : true,
					maxItems:15,
					sort : function(a,b){
						return ( a < b ) ? -1:1;
					},                    
					filter: Awesomplete.FILTER_STARTSWITH  
				});
			
			
			// listWidth : attribuer au UL autocomplete une largeur spécifique
			if ( field['listWidth'] )
				e.nextElementSibling.style.width = field['listWidth'];
		}
		
		
		// si évènement pour réagir
		if ( typeof field['onchange'] == 'function' )
		{
			// cas particulier liste autocomplete
			if ( field['autocomplete'] )
				e.addEventListener('awesomplete-selectcomplete', function(o){
					field['onchange'].call(e, o.text.value, o.text.label);
				});
			
			else
				e.addEventListener('change', field['onchange']);
		}

		
		
		// return field (already added in form)
		return div;
	}
	
	
	
	/** 
	 * Create form OK and Cancel buttons
	 *
	 * @param object params Object litteral describing dynamic form : pass the `params` parameter of `createForm` function
	 * @return HTMLElement Returns the node containing the buttons
	 */
	 
	function _createButtons(params)
	{
		var div = document.createElement('div');
		var btn = document.createElement('input');
		btn.type = 'submit';
		btn.value = nettools.ui.FormBuilder.i18n.BUTTON_ACCEPT;
		btn.name = "submit_button";
		div.appendChild(btn);

		var btn = document.createElement('input');
		btn.type = 'button';
		btn.value = nettools.ui.FormBuilder.i18n.BUTTON_CANCEL;
		btn.name = "cancel_button";
		btn.onclick = function(e)
			{
				if ( params['cancel'] && (typeof params.cancel === 'function') )
					params.cancel(params.target);
			};
		div.appendChild(btn);
		
		div.className="FormBuilderButtons";
		return div;
	}
	

	
	
	/**
	 * Handle new lines 
	 *
	 * @param object field Field definition (a value of `fields` object litteral parameter)
	 * @param HTMLElement container Node containing previously created fields, without any new lines
	 * @param object params Object litteral describing dynamic form : pass the `params` parameter of `createForm` function
	 * @return HTMLElement Returns either container argument or, if a new line is required, a newly created node that will receive upcoming created fields
	 */	 
	function _newLineBefore(field, container, params)
	{
		// if new line required
		if ( field['newLineBefore'] )
		{
			// add previous group of fields (no newlines between them) to the form, and create a new group
			if ( container.hasChildNodes() )
			{
				params.target.appendChild(container);
				return document.createElement('div');
			}
		}
		
		
		// return current group
		return container;
	}
		
	// ---- /PRIVATE ----
	
	
	return {
		
		EMAIL : 'email',
		TEXT : 'text',
		NUMBER : 'number',
		DATE : 'date',
		TEL : 'tel',
		
	
		/** 
         * Create the form as described in `params` argument
         *
         * @param object params Object litteral describing form and fields
         * @return HTMLFormElement Returns the created form
         */
		createForm : function(params)
		{
			params.fields = params['fields'] || {};
			params.target = params['target'] || document.createElement('form');
			
			
			// form name
			if ( params['name'] )
				params.target.name = params.name;
				
			
			// form style
			params.target.classList.add('FormBuilder');


			// if notice string
			if ( params['notice'] )
			{
				var div = document.createElement('div');
				div.innerHTML = params['notice'];
				div.classList.add('notice');
				params.target.appendChild(div);
			}
				

			// create a group of fields and begin creating them
			var curr_container = document.createElement('div');
			for ( var f in params.fields )
			{
				var field = params.fields[f];
				
				// handle newlines
				curr_container = _newLineBefore(field, curr_container, params);
				
				
				// specific cas for radio buttons : to easily grab user selection, 'name' must be identical for all radio buttons
				// however, we can't build an object litteral with identical keys.
				// so the radio buttons must be declared in an `items` property when defining the field
				if ( field.type === 'radio' )
				{
					// if label, we create it
					if ( field['label'] )
						curr_container.appendChild(_createLabel(f, null, field, false));
						
					
					// for all radio buttons
					for ( var r in field['items'] )
					{
						var fradio = field['items'][r];
						fradio.type = 'radio';
						
						// new line required
						curr_container = _newLineBefore(fradio, curr_container, params);
				

						// create the readion button, with common name 'f', the item name is only required to create object litteral keys
						var frad = _createField(fradio, f, params);
						curr_container.appendChild(frad);
						
						// store radio buttons in a form property array for easier access : form.elements.name_radio['item1_name']
						params.target.elements[f + '_radio'] = params.target.elements[f + '_radio'] || {};
						params.target.elements[f + '_radio'][fradio['name']] = frad.getElementsByTagName('input')[0];
					}
				}
				else
					// other field type
					curr_container.appendChild(_createField(field, f, params));
			}
			
			
			// add last field group in form
			params.target.appendChild(curr_container);			
			
			
			// create buttons
			params.target.appendChild(_createButtons(params));
			
			
			// handle form onsubmit event
			params.target.onsubmit = function(e)
				{
					// create form validator, with corresponding parameters in `params` : required, regexp, onsubmit, onsubmitpromise, notifier
					var _formValidator = new nettools.jscore.validator.FormValidator(params);
				
				
					// maybe we have to call a pre-submit event to format data, for example
					if ( params['presubmit'] && (typeof params.presubmit === 'function') )
						params['presubmit'](params.target.elements);
	
				
					// validate
					var st = _formValidator.isValid(params.target.elements);
				
				
					// ensuring 'submit' parameter is an object of class nettools.jscore.SubmitHandlers.Handler
					var sub = nettools.jscore.SubmitHandlers.Callback.toSubmitHandler(params['submit']);
					
				
					// if form validator has returned a Promise
					if ( st.constructor && (st.constructor.name === 'Promise') )
						st.then(
								function(st)
								{
									// sending form
									if ( sub )
										sub.submit(params.target, params.target.elements);
								}
							).catch(
								function(e)
								{
									// catch errors ; if validation failed, this has already been handled inside _formValidator.isValid()
									if ( e instanceof Error )
										nettools.jscore.RequestHelper.promiseErrorHandler(e);
								}
							);
					
					// if form validator has returned a status
					else 
					if ( st.status )
						// sending form
						sub.submit(params.target, params.target.elements);
	
	
					// never submit form
					return false;
				};
			
								
			return params.target;
		},
		
        
		
		/**
         * Create an object litteral as expected for `fields` parameter from a Json string
         *
         * @param string str Json string to parse
         * @return object Returns an object litteral decribing fields from Json data
         */
		jsonToFields : function(str)
		{
			var ret = JSON.parse(str);
            if ( !ret )
                return {};

			// create simple field definition : type 'text' and value
			for ( var field in ret )
				ret[field] = {type:'text', value:ret[field]};
			
			return ret;
		}
		
	};
})();


// i18n
nettools.ui.FormBuilder.i18n = {
	PATTERN_EMAIL : 'Valid email address (no accent, no space)',
	PATTERN_DATE : 'Date with format yyyy-mm-dd',
	PATTERN_TEL : 'Any valid phone number',
	PATTERN_NUMBER : 'Any integer',
	BUTTON_ACCEPT : 'Accept',
	BUTTON_CANCEL : 'Cancel'
}








// ==== WINDOW MANAGEMENT ====
nettools.ui.window = {
	
    /**
     * Open a popup window
     * 
     * @param string url 
     * @param string name Window name
     * @param int w Window width
     * @param int h Window height
     * @param bool scrollbars Set true to display scrollbars
     * @return Window Returns the window objet
     */
	popup : function (url, name, w, h, scrollbars)
	{
		if ( (scrollbars === undefined) || (scrollbars === null) )
			scrollbars = false;
			
		// -16 for window borders, -74 for borders + menu bar + address bar
		var px = Math.round((screen.width - w - 16) / 2); 
		var py = Math.round((screen.height - h - 74) / 2);
		var wnd = window.open (url, name,'toolbar=0,scrollbars=' + (scrollbars ? "1" : "0") + ',statusbar=0,menubar=0,resizable=1,top=' + py + 'screenY=' + py + ',left=' + px + ',screenX=' + px + ',width=' + w + ',height=' + h);
		
		return wnd;
	},


    
	/** 
     * Close popup window without browser asking confirmation
     */
	fermer : function()
	{
		var obj_window = window.open('', '_self');
		obj_window.opener = window; 
		obj_window.focus(); 
		opener=self; 
		self.close();
	},


    
	/** 
     * Test if a popup window has been blocked by browser
     *
     * @param Window poppedWindow Window object to test
     * @return bool
     */
	hasPopupBlocker : function (poppedWindow)
	{
		var result = false;
	
		try {
			if (typeof poppedWindow === 'undefined') {
				// Safari with popup blocker... leaves the popup window handle undefined
				result = true;
			}
			else if (poppedWindow && poppedWindow.closed) {
				// This happens if the user opens and closes the client window...
				// Confusing because the handle is still available, but it's in a "closed" state.
				// We're not saying that the window is not being blocked, we're just saying
				// that the window has been closed before the test could be run.
				result = false;
			}
			else if (poppedWindow && poppedWindow.com.ui.desktop.util.window) {
					if (Number(poppedWindow.outerHeight) === 0)
						result = true;
					else
						// This is the actual test. The client window should be fine.
						result = false;
			}
			else {
				// Else we'll assume the window is not OK
				result = true;
			}
	
		} catch (err) {
			//if (console) {
			//    console.warn("Could not access popup window", err);
			//}
		}
	
		return result;
	}
};





