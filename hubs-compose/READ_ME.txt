Welcome to the Read Me File!

I would like to mention a couple of important details before getting started.

1. This local Hubs application is built on  Microsoft Windows 10 Enterprise version "10.0.19045 Build 19045".
2. Hubs can be installed by following the instructions below but Molecular Hubs virtual room is not hosted and it is not accessible from public audience. It can only be run on CSVR-05 machine which is located in UCC Western Gateway Building room 1.30.
3. This application was supposed to run on other machines with the same private network, by running the local IP address and port number 4000. However, this has not been achieved due to CORS related errors.
4. The following instructions are completed to run Hubs Platform locally. The application itself will be installed on your computer without the virtual room designed for Second-Level Biology learners. 
5. In order to host this application with the designed virtual room, Tunnelling operations have to be made, however this couldn't get achieved due to time constraints.
6. This method is the most appropriate way to run Hubs Platform after it was being outdated on 31st, May 2024!

	
	It's better to skill up first on this technologies and tools:
	
	1. JavaScript
	2. React.js
	3. Webpack development server
	4. Basic Elixir and Phoenix Framework
	5. Web Socket	

 The following prerequisites are compulsory to be able to run hubs locally on your computer: 

	1. Use Git Bash to run scripts (RECOMMENDED!)
	2. Windows Subsystem 2 could be used but it is OPTIONAL! Here's the link for installation on Windows --> https://learn.microsoft.com/en-us/windows/wsl/install
	3. At least 8GB of RAM.
`	4. Using fast CPU is recommended.
	5. Node.js must be configured. I used Node version 16.3 on this device (CSVR-05).
	6. Some scripts rely on Unix-Line Endings. If you're running Hubs Docker installation on Windows, you may need to modify your 'Git' line ending settings to ensure your local files include Unix-style line endings.
	7. The "Git Bash" shell included with Git - also known as 'MINGW64' - will work to run these scripts however, Windows Terminal will not work to run these scripts.
	
 	
 Initial Setup:
	
	1. Install Docker Compose


		The easiest and recommended approach to get Docker Compose is to install Docker Desktop since it includes Docker Compose along with Docker Engine and Docker CLI which are Compose prerequisites.
		
		If you are on Windows, You can install Docker Compose from this link: https://docs.docker.com/desktop/install/windows-install/
		
		System Requirement Tips:
		
		Docker Desktop's functionality remains consistent on both WSL and Hyper-V, without a preference for either architecture.
		If you're using Windows Subsystems for Linux 2 (WSL 2), Virtualization features of the system must be enabled. 
		WSL 2 relies on virtualization technology to run a lightweight virtual machine, providing better performance
 		and compatibility with Docker and Local Hubs installation.
			
			- Press Windows Key +, type 'optionalfeatures', and press 'Enter'. This opens the Windows Features dialog.
			- Scroll down and check box for 'Virtual Machine Platform'. Also ensure that Windows Subsystems for Linux is checked. 
			- Click OK and wait for features to install.
			- Restart your computer.
			- Set WSL 2 as the Default Version by running PowerShell as Administrator and running this command: wsl --set-default-version 2
			
	2. Install Mutagen
		
		Mutagen can be installed from these releases --> https://github.com/mutagen-io/mutagen/releases/tag/v0.17.6
		
		
	3. Install Mutagen Compose

		Mutagen-Compose can be installed from these releases --> https://github.com/mutagen-io/mutagen-compose/releases
	
		Ensure that the version of Mutagen Compose you're installing matches the version of Mutagen that you installed.

	4. Add these entries to your 'hosts' file, is probably located at 'C:\Windows\System32\drivers\etc\hosts' : 
		
		127.0.0.1   hubs.local
 		127.0.0.1   hubs-proxy.local
		
	
	5. Clone this repository onto your device with this command on Git Bash or WSL 2:

		 git clone https://github.com/Hubs-Foundation/hubs-compose


	6. Initialize the services with Git Bash or WSL 2. 

		
		Open up a new Git Bash terminal and type this command in the project folder --> /c/Users/user_name/Desktop/hubs-compose bin/init
		
		with WSL 2 --> /mnt/c/Users/user_name/Desktop/hubs-compose bin/init
			
		This will copy a local clone of all four repositories - Hubs, Spoke, Dialog, and Reticulum - and build them into Docker images and volumes. 

		This setup phase which can take ~30 minutes.
		
		Once our Docker images and volumes are built, we can see a new '/services/' directory has been added to our local project file.


	7. Run bin/up command in the 'hubs-compose' project file for orchestration.

		
		If this is successful, you should see containers created for all of the following:

			-db
			-dialog
			-hubs-admin
			-hubs-client
			-hubs-storybook
			-mutagen
			-postgrest
			-reticulum
			-spoke

	8. Once the container are up and running in Docker Desktop, we should fire up the browser by ignoring certificate errors. Personally, I have used Google Chrome and ignored certificate-based errors to fire up the browser.


	In Git Bash, type this command:

		"/c/Program Files/absolute_path/to/your/web_browser/" --ignore-certificate-errors

		This command fires up Chrome executable binary by ignoring HTTPS protocol-based errors. If you need to set up HTTPS, then you need to configure Self-Signed Certificates(SSL) for each server by utilizing OpenSSL or online RSA Key Generators.

		To note; I have built SSL certificates successfully in the manual installation approach of Hubs platform, as its mention on the thesis file. But, this docker-based installation method isn't configured with HTTPS.

		In WSL 2: 
		

		"/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" --ignore-certificate-errors


	9. Go on your Google Chrome Browser, and type this to open up Chrome Flags: chrome://flags/

		Then allow the following flags:

			- Allow invalid certificates for resources loaded from localhost --> Enabled
			- WebXR Incubations --> Enabled
			- Insecure origins treated as secure --> Enabled
				
				- In the text box below, please type this URLs: 

					- https://localhost:4000,https://hubs.local:8080,https://hubs.local:4000

	
	10. Open https://hubs.local:4000 to ensure that the application is working seamlessly and then, attempt to signing with an e-mail address. To note, Hubs-Compose is not a fully features Hubs Platform, meaning that It would normally require Simple Mail Transfer Protocol (SMTP) service to allow users to log in. Since SMTP will not be configured on this local development application, we'll need to find a workaround to authenticate users.

	- Attempt to sign in on https://hubs.local:4000
	- Open reticulum container's log from Docker Desktop, and look for a log with the magic URL email access link! Copy and Paste this link in the same browser (NOT ON ANY OTHER BROWSER), for complete verification:
	
	-You will see an access link like this(This is just an example, don't use this as your own access link!):
	
		%Bamboo.Email{from: {nil, "info@hubs-mail.com"}, to: [nil: "mmorran@mozilla.com"], cc: [], bcc: [], subject: "Your  Sign-In Link", html_body: nil, text_body: "To sign-in to , please visit the link below. If you did not make this request, please ignore this e-mail.\n\n https://hubs.local:4000/?auth_origin=hubs&auth_payload=GPk2GOEbz9AcHROddvD%2F20%2B11FcKH%2FbKTj62gPCyUgjpeogFp94zpQoBh9nrBiY%2F16KYiGka0dseW9mDlN7n&auth_token=ca3ff98f63c4b7709d0b1c01a217f414&auth_topic=auth%3Add0ec69c-bfa2-4994-b183-aca1377b2f11", headers: %{}, attachments: [], assigns: %{}, private: %{}}


	-After pasting it and waiting for a couple of seconds, you will see a verification completed pop up message ın the page. Then please close that browser tab and go back to the previous one. You'll see that there's two new buttons on the page, the first one is Scene Editor (Spoke), and the second one is Admin(Hubs administration)button.This means that you're authenticated and free to create your own virtual scenes in Spoke and manage them view Admin. 


	- To note, you can only view the admin page from this URL --> https://hubs.local:4000/admin
	- NOT FROM THIS URL !!!!! --> https://localhost:4000/admin --> If you try to run this you won't be permitted to use the features on the left hand-side vertical navigation bar!


	11. We must promote this account to give it an administration access (Creating an Admin User!). This is a strict requirement in order to run 'Hubs/Admin' to view and manipulate scene information and data, such as Pending Scenes and etc., in this URL --> https://hubs.local:4000/admin

		- Go to the interactive session ('Exec' tab in Reticulum Container.)
		- Start Interactive Elixir Shell  with this command:

			iex -S mix

	
		- Then paste this to authenticate your e-mail address as a trusted account (This enumerates the number of authentication applications and you'll be Number 0 since you're the first applicant!)

			Ret.Account |> Ret.Repo.all() |> Enum.at(0) |> Ecto.Changeset.change(is_admin: true) |> Ret.Repo.update!()


	12. Enabling Room Features

	Rooms are created with restricted permissions by default, which means you can't spawn media objects. You can either change this setting in the Admin Page or, you can do it in Interactive Elixir Shell (IEX) in Reticulum's Exec!

		iex -S mix (If Interactive Elixir Shell (IEX) is not running, use this to run it again.)

		Ret.AppConfig.set_config_value("features|permissive_rooms", true)

	
	13. Test your application

	At this stage, I would recommend to test everything to see whether it is successfully built. You must be able to use Spoke to add your 3D models and elements, save and publish those files to be allowed to view as Virtual Rooms, or you must be able to create rooms from scratch from the main landing page (Hubs/Client). Please verify the validity of these features and observe the real-time chat features to get yourself familiar with the application!


	14. Other Setting Scripts of Hubs Compose

	 -bin/down | When I am done developing, I run this command to remove my Docker containers.
	 -bin/observe | This command helps you view container information and logs.
	 -bin/services-update | This command will re-install each of the Hubs codebases without erasing your local development data.
	 -bin/reset | This command fully resets your local development instances and data, removing your volumes in the process.	


	

	

	


