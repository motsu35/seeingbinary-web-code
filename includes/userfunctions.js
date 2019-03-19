var Typer={
	text: null,
	accessCountimer:null,
	index:0, // current cursor position
	speed:2, // speed of the Typer
	file:"", //file, must be setted
	command:"",
	askingpw:0,
	password:"",
	history:[],
	cmdnum:0,
	stage:1,
	passwordCounter:0,
	init: function(){// inizialize Hacker Typer
		accessCountimer=setInterval(function(){Typer.updLstChr();},500); // inizialize timer for blinking cursor
		$.get(Typer.file,function(data){// get the text file
			Typer.text=data;// save the textfile in Typer.text
			Typer.text = Typer.text.slice(0, Typer.text.length-1);
		});
	},
 
	content:function(){
		return $("#console").html();// get console content
	},
 
	write:function(str){// append to console content
		$("#console").append(str);
		return false;
	},
 
	addText:function(key){//Main function to add the code
		if(Typer.text)
		{
			var cont=Typer.content(); // get the console content
			if(cont.substring(cont.length-1,cont.length)=="|") // if the last char is the blinking cursor
				$("#console").html($("#console").html().substring(0,cont.length-1)); // remove it before adding the text
			
			Typer.index+=Typer.speed;	// add to the index the speed
			
			var text=Typer.text.substring(0,Typer.index)// parse the text for stripping html enities
			var rtn= new RegExp("\n", "g"); // newline regex
	
            		try(){
		                $("#console").html(text.replace(rtn,"<br/>"));// replace newline chars with br, tabs with 4 space and blanks with an html blank
			}
			catch(e){ };

			if(Typer.index > Typer.text.length)
			{
				Typer.text = "";
				clearInterval(timer);
			}
			window.scrollBy(0,50); // scroll to make sure bottom is always visible
		}
	},
 
	updLstChr:function(){ // blinking cursor
		var cont=this.content(); // get console 
		if(cont.substring(cont.length-1,cont.length)=="|") // if last char is the cursor
			$("#console").html($("#console").html().substring(0,cont.length-1)); // remove it
		else
			this.write("|"); // else write it
	}
}

//Below is the code fot the automated text.
if(Typer.stage == 1)
{
	Typer.speed=10;
	Typer.file="welcome.txt";
	Typer.init();


	 
	 
	var timer = setInterval("t();", 30);
	function t() {
		if(Typer.text)
		{
			Typer.addText({"keyCode": 123748});
			if (Typer.index > Typer.text.length) 
			{
				clearInterval(timer);
			}
		}
	}
}


///display functions:
function newCmdLine() //writes a new command line for after input.
{
	Typer.write('<span id="a">user@SeeingBinary</span><span id="d">:</span><span id="b">~</span><span id="c">$</span><span id="d" class="input"></span>');
}

function newPwLine()
{
	if(Typer.passwordCounter == 0)
	{
		$('span.output').last().text("Enter Password: ");
		Typer.passwordCounter++;
	}
	else if(Typer.passwordCounter < 3)
	{
		Typer.write('</br><span id="d" class="output">Enter Password:</span>');
		Typer.passwordCounter++;
	}
	else
	{
		Typer.write('</br>');
		newCmdLine();
		Typer.passwordCounter = 0;
		Typer.askingpw = 0;
	}
}

function parseCommand(command) //a large function that parses user commands. might want to clean this up later.
{
	///DEFINE FILE FUNCTIONS
	openProjects = function()
	{
		$('span.output').last().text("theres nothing here :(");
		Typer.write('</br><span id="d" class="output">maybe when im not hacking i can get content on this</span>');
		Typer.write("</br>");
	}
	openAboutme = function()
	{
		$('span.output').last().text("im a hacker, yo <3");
		Typer.write("</br>");
	}

	///DEFINE FILE DICTIONARY (if there is a string, it will open the file string in a new tab),else calls function:
	var files = {};
	files["projects.xml"] = openProjects;
	files["resume.pdf"] = "resume.pdf";
	files["aboutme.txt"] = openAboutme;
	////START LARGE IF / ELSE TREE FOR COMMANDS:
	if(!command) //if they press enter with out a command, just return a new line and do nothing.
	{
		Typer.write("</br>");
		return false;
	}

	Typer.write('</br><span id="d" class="output"></span>'); //we have a command, make our first line of output.
	
	
	if(command.split(" ")[0] == "ls")// command = ls
	{
		if(command.split(" ").length == 1)//no added arguments, just do the basic ls.
		{
			Object.keys(files).forEach(function(index) 
			{ 
				$('span.output').last().text($('span.output').last().text() + index + " ");
			});
			Typer.write("</br>");
		}
		else if(command.split(" ").length == 2)//theres a second param. handle it.
		{
			if(command.split(" ")[1] == "-l")//added long flag, just line split them.
			{	
				Object.keys(files).forEach(function(index) 
				{ 
					$('span.output').last().text($('span.output').last().text() + index);
					Typer.write('</br><span id="d" class="output"></span>');
				});
			}
			else if(command.split(" ")[1] == "-a")//add dot files
			{
				$('span.output').last().text(". .. ");
				Object.keys(files).forEach(function(index) 
				{ 
					$('span.output').last().text($('span.output').last().text() + index + " ");
				});
				Typer.write("</br>");
			}
			else if(command.split(" ")[1] == "-la" || command.split(" ")[1] == "-al")//output list with dot files.
			{
				$('span.output').last().text(".");
				Typer.write('</br><span id="d" class="output">..</span>');
				Typer.write('</br><span id="d" class="output"></span>');

				Object.keys(files).forEach(function(index) 
				{ 
					$('span.output').last().text($('span.output').last().text() + index);
					Typer.write('</br><span id="d" class="output"></span>');
				});
			}
			else//some unknown flag.
			{
				$('span.output').last().text("Error: ls: unknown flags. use help ls for more info.");
				Typer.write("</br>");
			}
		}
		else//too many args.
		{
			$('span.output').last().text("Error: ls: too many arguments for ls. use help ls for more info.");
			Typer.write("</br>");
		}
	}
	else if(command.split(" ")[0] == "clear")//command = clear
	{
		if(command.split(" ").length == 1)//no params, clear screen.
		{
			var myNode = document.getElementById("console");
			while (myNode.firstChild) 
			{
				myNode.removeChild(myNode.firstChild);
			}
		}
		else//display error.
		{
			$('span.output').last().text("Error: clear: too many arguments for clear. use help clear for more info.");
			Typer.write("</br>");
		}
	}


	else if(command.split(" ")[0] == "help")//command = help
	{
		if(command.split(" ").length == 1) //no params, show commands.
		{
			$('span.output').last().text("Current commands:");
			Typer.write('</br><span id="d" class="output">&nbsp;&nbsp;&nbsp;ls</span>');
			Typer.write('</br><span id="d" class="output">&nbsp;&nbsp;&nbsp;clear</span>');
			Typer.write('</br><span id="d" class="output">&nbsp;&nbsp;&nbsp;open</span>');
			Typer.write('</br><span id="d" class="output">&nbsp;&nbsp;&nbsp;su</span>');
			Typer.write('</br><span id="d" class="output">&nbsp;&nbsp;&nbsp;help</span>');
			Typer.write('</br><span id="d" class="output"> to see command usage, type help &lt;command&gt;.</span>');
			Typer.write("</br>");
		}
		else if(command.split(" ").length == 2) //second arg, someone asking for help on a command.
		{
			if(command.split(" ")[1] == "ls")//show ls usage.
			{
				$('span.output').last().text("ls usage:");
				Typer.write('</br><span id="d" class="output">ls &lt;-flags&gt; | lists current directory contents.</span>');
				Typer.write('</br><span id="d" class="output">&nbsp;&nbsp;flags:</span>');
				Typer.write('</br><span id="d" class="output">&nbsp;&nbsp;&nbsp;&nbsp;a - list all files, including hidden files.</span>');
				Typer.write('</br><span id="d" class="output">&nbsp;&nbsp;&nbsp;&nbsp;l - list files on new lines.</span>');
				Typer.write("</br>");
			}
			else if(command.split(" ")[1] == "clear")//show clear usage
			{
				$('span.output').last().text("clear | clears current screen.");
				Typer.write('</br><span id="d" class="output">&nbsp;&nbsp;clear takes no parameters.</span>');
				Typer.write("</br>");
			}
			else if(command.split(" ")[1] == "help")//show help usage
			{
				$('span.output').last().text("help usage:");
				Typer.write('</br><span id="d" class="output">help &lt;command&gt; | shows usage for command, if specified. otherwise shows avalible commands.</span>');
				Typer.write("</br>");
			}
			else if(command.split(" ")[1] == "open" || command.split(" ")[1] == "cat" )//show open usage
			{
				$('span.output').last().text("open [file | url]| opens file or url.");
				Typer.write('</br><span id="d" class="output"></span>');
				Typer.write('</br><span id="d" class="output">&nbsp;&nbsp;note:url MUST begin with http or https.</span>');
				Typer.write("</br>");
			}
			else if(command.split(" ")[1] == "su")//show open usage
			{
				$('span.output').last().text("su [user]| substitute user identity");
				Typer.write('</br><span id="d" class="output">&nbsp;&nbsp;Use su to switch user accounts. su takes in a user name, and then prompts for a password.</span>');
				Typer.write("</br>");
			}
			else//unknown command.
			{
				$('span.output').last().text("Error: help: unknown command to fetch help for.");
				Typer.write("</br>");
			}
		}
		else//too many args.
		{
			$('span.output').last().text("Error: help: too many arguments for help. use help help for more info.");
			Typer.write("</br>");
		}
	}
	
	
	else if(command.split(" ")[0] == "open" || command.split(" ")[0] == "cat")//command = open
	{
		if(command.split(" ").length == 1)//nothing to open. error that shit!
		{
			$('span.output').last().text("Error: open: enter a file or url to open.");
			Typer.write("</br>");
		}
		else if(command.split(" ").length == 2)//ah, just right... lets process the url or file
		{
			if(command.split(" ")[1].split("://")[0] == "http" || command.split(" ")[1].split("://")[0] == "https")//url found, redirect there
			{
				window.location = command.split(" ")[1];
			}
			else if(files.hasOwnProperty(command.split(" ")[1]))//open the file
			{
				if(typeof files[command.split(" ")[1]] === "string")
				{
					window.open(files[command.split(" ")[1]],'_blank');
				}
				else
				{
					files[command.split(" ")[1]](); //call the function in the object array.
				}
			}
			else
			{
				$('span.output').last().text("Error: open: unknown file or url.");//something went wrong.
				Typer.write("</br>");
			}
		}
		else//too many args
		{
			$('span.output').last().text("Error: open: too many arguments for open. use help open for more info.");
			Typer.write("</br>");
		}
	}
	
	else if(command.split(" ")[0] == "su")
	{
		if(command.split(" ").length == 1)
		{
			$('span.output').last().text("Error: su: not enough arguments for su. use help su for more info.");
			Typer.write("</br>");
		}
		else if(command.split(" ").length == 2)
		{
			if(command.split(" ")[1] == "root")
			{
				Typer.askingpw = 1;
			}
			else
			{
				$('span.output').last().text("Error: su: unknown user.");//unknown command
				Typer.write("</br>");
			}
		}
		else
		{
			$('span.output').last().text("Error: su: too many arguments for su. use help su for more info.");//something went wrong.
			Typer.write("</br>");
		}
	}

	else if(command == "im a noob")
	{
		window.location = "https://www.youtube.com/watch?v=SXmv8quf_xM";
	}
	
	else//command isnt found
	{
		$('span.output').last().text("-bash: "+command.split(" ")[0]+": command not found. type help for a list of commands");
		Typer.write("</br>");
	}

	return false;
}

//backspace keypress handler.
$(document).on("keydown", function (e)
{
	if (e.which === 8 && !$(e.target).is("input, textarea")) 
	{
		e.preventDefault();//this stops page from going back.
		Typer.command = Typer.command.substring(0,Typer.command.length -1);//remove last char from command.
		if(Typer.askingpw == 0)
		{
			$('span.input').last().text( $('span.input').last().text().substring(0, $('span.input').last().text().length-1));//remove last char from screen.
		}
	}

	if (e.which === 32 && !$(e.target).is("input, textarea")) //space pressed
	{
		if(Typer.askingpw == 0)
		{
			$('span.input').last().text( $('span.input').last().text()+ " ");
			Typer.command += (" ");
		}
		else
		{
			Typer.password += (" ");
		}
	}

	if (e.which === 38 && !$(e.target).is("input, textarea")) //up arrow pressed
	{
		if(Typer.askingpw == 0)
		{
			if(Typer.cmdnum > 0)
			{
				$('span.input').last().text(Typer.history[--Typer.cmdnum]);
				Typer.command = (Typer.history[Typer.cmdnum]);
			}
		}
		else
		{
			//do nothing
		}
	}
	if (e.which === 40 && !$(e.target).is("input, textarea")) //down arrow pressed
	{
		if(Typer.askingpw == 0)
		{
			if(Typer.cmdnum < Typer.history.length)
			{
				$('span.input').last().text(Typer.history[++Typer.cmdnum]);
				Typer.command = (Typer.history[Typer.cmdnum]);
			}
			if(Typer.cmdnum == Typer.history.length)
			{
				$('span.input').last().text("");
				Typer.command = "";
			}
		}
		else
		{
			//do nothing
		}
	}
});


//stage 1 keypress handler.
$(document).on("keypress", function (e)//keydown doesnt get charCode, only keyCode... so get key values here.
{
	if(Typer.stage == 1)
	{
		var cont=Typer.content(); // get the console content
		if(cont.substring(cont.length-1,cont.length)=="|") // if the last char is the blinking cursor
		$("#console").html($("#console").html().substring(0,cont.length-1)); // remove it before adding the text

	
		if(e.keyCode == 13)//if enter key is pressed, submit the command.
		{
			if(Typer.askingpw == 1) // user has typed in a password! check it!
			{
				$.post("includes/auth.php",{'auth':md5(Typer.password)},function(result){
				
					if(result == "Incorrect password!\n")
					{
						var cont=Typer.content(); // get the console content
						if(cont.substring(cont.length-1,cont.length)=="|") // if the last char is the blinking cursor
						$("#console").html($("#console").html().substring(0,cont.length-1)); // remove it before adding the text
						
						Typer.password = "";
						newPwLine();
					}
					else
					{
						//var cont=Typer.content(); // get the console content
						//if(cont.substring(cont.length-1,cont.length)=="|") // if the last char is the blinking cursor
						//$("#console").html($("#console").html().substring(0,cont.length-1)); // remove it before adding the text
						
						Typer.askingpw = 0;
						Typer.password = "";
						
						//Typer.write(result);
						eval(result);
						//Typer.write("</br>");
						//newCmdLine();
					}
				});
			}


			if(Typer.askingpw == 0)//a non password command was entered.
			{
				if(Typer.command != "")
				{
					Typer.history.push(Typer.command);
					Typer.cmdnum = Typer.history.length;
				}

				parseCommand(Typer.command);
				Typer.command = "";
				if(Typer.askingpw == 0)
				{
					var cont=Typer.content(); // get the console content
					if(cont.substring(cont.length-1,cont.length)=="|") // if the last char is the blinking cursor
					$("#console").html($("#console").html().substring(0,cont.length-1)); // remove it before adding the text
					
					newCmdLine();
				}
				else
				{
					var cont=Typer.content(); // get the console content
					if(cont.substring(cont.length-1,cont.length)=="|") // if the last char is the blinking cursor
					$("#console").html($("#console").html().substring(0,cont.length-1)); // remove it before adding the text
					
					newPwLine();//make first password line.
				}
			}
		}
		else if(e.keyCode == 8)
		{
			//do nothing! backspace handled above
		}
		else if(e.keyCode == 32)
		{
			//do nothing! space handled above
		}
		else//add the letter to the screen.
		{
			if(Typer.askingpw == 0)
			{
				$('span.input').last().text( $('span.input').last().text()+ String.fromCharCode(e.charCode));
				Typer.command += (String.fromCharCode(e.charCode));
			}
			else
			{
				Typer.password += (String.fromCharCode(e.charCode));
			}
		}
	}
});
