// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name default.js
// @language_out ECMASCRIPT_2017
// ==/ClosureCompiler==


window.nettools = window.nettools || {};
nettools.ui = nettools.ui || {};





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

