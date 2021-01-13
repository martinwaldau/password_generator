var Generator = {
	vowels: 'aeiou',
	consonants: 'abcdfghjklmnpqrstvwxyz',
	specialVowels: ['ei', 'ie', 'eu', 'ou'],
	specialConsonants: ['sch', 'ch', 'st', 'th', 'tt', 'pp', 'tz'],
	leetReplacements: {'e': 3, 'a': 4, 'i': 1, 's': 5, 't': 7, 'o': 0},
	groupLength: 0,
	groupAmount: 0,
	passwordListLength: 10,
	useCapitalization: true,
	useLeetify: false,
	passwordListElement: null,
	maxRandomAttempts: 2,

	setPasswordListElement: function(element)
	{
		this.passwordListElement = element;
	},

	setGroupLength: function(length)
	{
		this.groupLength = parseInt(length);
	},

	setGroupAmount: function(length)
	{
		this.groupAmount = parseInt(length);
	},

	setUseCapitalization: function(value)
	{
		this.useCapitalization = (value == true);
	},

	setLeetify: function(value)
	{
		this.useLeetify = (value == true);
	},

	generate: function()
	{
		var passwords = this.generatePasswords();
		this.displayPasswords(passwords);
	},

	displayPasswords: function(passwords)
	{		
		while (this.passwordListElement != null && this.passwordListElement.hasChildNodes()) 
		{
			this.passwordListElement.removeChild(this.passwordListElement.firstChild);
		}

		for(let i = 0; i < passwords.length; i++)
		{
			let node = document.createElement('button');
			node.setAttribute('type', 'button');
			node.classList.add('btn');
			node.classList.add('btn-outline-secondary');
			let glyph = document.createElement('i');
			glyph.classList.add('bi');
			glyph.classList.add('bi-clipboard');
			node.appendChild(glyph);
			node.appendChild(document.createTextNode(passwords[i]));
			this.passwordListElement.appendChild(node);	
		}
	},

	generatePasswords: function()
	{
		return this._generateGroupBasedPasswords();
	},

	_generateGroupBasedPasswords: function()
	{
		var passwords = [];
		let safety = this.passwordListLength * 2;
		let runs = 0;
		while(passwords.length < this.passwordListLength || runs > safety)
		{
			let password = '';
			runs++;
			for (var i = 0; i < this.groupAmount; i++)
			{
				let passwordSection = '';
				let previous = 0;
				let groupSafety = this.groupLength * 2;
				let groupRuns = 0;
				while(passwordSection.length < this.groupLength || groupRuns > groupSafety)
				{
					groupRuns++;
					let capitalize = (this.getDirection() == 1 && this.useCapitalization) ? true : false;
					if (previous == 0)
					{
						if (this.getDirection() == 0)
						{
							passwordSection += this.getRandomChar(this.vowels, capitalize, passwordSection);
						}
						else
						{
							passwordSection += this.getRandomChar(this.specialVowels, false, passwordSection);
						}
						previous = 1;
					}
					else
					{
						if (this.getDirection() == 0)
						{
							passwordSection += this.getRandomChar(this.consonants, capitalize, passwordSection);
						}
						else
						{
							passwordSection += this.getRandomChar(this.specialConsonants, false, passwordSection);
						}
						previous = 0;
					}
				}
				passwordSection = passwordSection.substring(0, this.groupLength);
				password += passwordSection  + "-";
			}
			password = password.substring(0, password.length - 1);
			if (this.useLeetify)
			{
				for(let i = 0; i < password.length; i++)
				{
					if (this.leetReplacements.hasOwnProperty(password[i]))
					{
						password = password.replace(password[i], this.leetReplacements[password[i]]);
					}
				}
			}

			passwords.push(password);
		}
		return passwords;
	},

	getRandomChar: function(source, capitalize, currentString)
	{
		var char = '';
		var count = 0;
		do
		{
			if ( typeof source == 'string')
			{
				var start = Math.floor(Math.random() * source.length);
				if (capitalize)
					char = source.substring(start, start + 1).toUpperCase();
				else
					char = source.substring(start, start + 1)
			}
			else
			{
				var key = Math.floor(Math.random() * source.length);
				char = source[key];
			}
			count++;
		}
		while(currentString.includes(char) && count < this.maxRandomAttempts);

		return char;
	},

	getDirection: function()
	{
		return Math.floor((Math.random() * 10) + 1) % 2;
	}
};