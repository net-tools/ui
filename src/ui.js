// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name default.js
// @language_out ECMASCRIPT_2017
// ==/ClosureCompiler==


window.nettools = window.nettools || {};
nettools.ui = nettools.ui || {};








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

