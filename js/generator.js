var Generator = {
	vowels: 'aeiou',
	consonants: 'abcdfghjklmnpqrstvwxyz',
	specialVowels: ['ei', 'ie', 'eu', 'ou'],
	specialConsonants: ['sch', 'ch', 'st', 'th', 'tt', 'pp', 'tz'],
	numbers: '0123456789',
	specialChars: '+*.,;:-_#',
	pwdLength: 14,
	amount: 10,
	useCapitalization: true,
	useSpecialChars: true,
	useNumbers: true,
	passwordListElement: null,
	maxRandomAttempts: 2,

	setPasswordListElement: function(element)
	{
		this.passwordListElement = element;
	},

	setPasswordLength: function(length)
	{
		this.pwdLength = length;
	},

	setUseCapitalization: function(value)
	{
		this.useCapitalization = (value == true);
	},

	setUseSpecialChars: function(value)
	{
		this.useSpecialChars = (value == true);
	},

	setUseNumbers: function(value)
	{
		this.useNumbers = (value == true);
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

		for(var i = 0; i < passwords.length; i++)
		{
			var node = document.createElement('li');
			node.appendChild(document.createTextNode(passwords[i]));
			this.passwordListElement.appendChild(node);	
		}
	},

	generatePasswords: function()
	{
		var passwords = [];
		while(passwords.length < this.amount)
		{
			var password = '';
			var previous = this.getDirection();
			var reduceLength = 3;
			if (!this.useNumbers)
				reduceLength -= 2;
			if (!this.useSpecialChars)
				reduceLength -= 1;

			while(password.length < this.pwdLength - reduceLength)
			{
				var capitalize = (this.getDirection() == 1 && this.useCapitalization) ? true : false;
				if (previous == 0)
				{
					if (this.getDirection() == 0)
					{
						password += this.getRandomChar(this.vowels, capitalize, password);
					}
					else
					{
						password += this.getRandomChar(this.specialVowels, false, password);
					}
					previous = 1;
				}
				else
				{
					if (this.getDirection() == 0)
					{
						password += this.getRandomChar(this.consonants, capitalize, password);
					}
					else
					{
						password += this.getRandomChar(this.specialConsonants, false, password);
					}
					previous = 0;
				}
			}

			if (this.useSpecialChars)
				password += this.getRandomChar(this.specialChars, false, password);
			if (this.useNumbers)
			{
				password += this.getRandomChar(this.numbers, false, password);
				password += this.getRandomChar(this.numbers, false, password);
			}
			passwords.push(password.substring(0, this.pwdLength));
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