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
	 * @param string img
	 * @return string Returns a string describing line item content as HTML formatting
	 */
	static image(img)
	{
		return `<img src="${img}">`;
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
				return new nettools.ui.Size(this.size + value.size, this.unit);
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
				return new nettools.ui.Size(this.size - value.size, this.unit);
			else
				throw new Error('Cannot subtract a Size object from another with different units');
		else
			return new nettools.ui.Size(this.size - Number(value) + this.unit);
	}
}

