### UI Challenge

For the purposes of this exercise, a dashboard is rich application page that is rendered within a browser that includes one or more sub-elements in the page represented as widgets. Ideally, the code presented will work across multiple browsers including Chrome, Firefox and Internet Explorer.

The intention of this challenge is to show a candidate’s ability to provide a reasonably complex user interface that interacts with a back-end data source leveraging asynchronous data communication mechanisms.

Create a map dashboard showing network related information associated with a set of IP addresses distributed across the globe and the US.  Network related information to the IP is defined as:

a)	Virus 
i.	One or more viruses associated with the IP
ii.	The virus names to use are:
1.	APT1
2.	Spam
3.	Botnet
4.	StealCreds

b)	Owner
i.	who owns the IP
ii.	The owner is a string of up-to 256 characters representing a person or business entity.
iii.	An owner may be associated with one or more IP addresses

c)	Function
i.	what the IP does 
ii.	The function names to use are:
1.	web server
2.	mail server
3.	ftp server

The dashboard should be defined in Javascript, and have 3 primary requirements:

1.	Data Server 
a.	That will offer the IP related information contained within data.json.  Every five seconds, generate two additional IP addresses with data counts and latitude/longitude coordinates.  Use random number generation to create this data. The data counts can represent the number of viruses, the number of web servers, the number of mail servers and their association to the IP addresses.
2.	Data Render
a.	That will receive data both initial and update data in the user interface.  
b.	The view will automatically be refreshed and updated as data is received from the Data Server component.
3.	Data Interaction
a.	Ensure the dashboard allows zoom capability on the geographic map
b.	Ensure the dashboard may choose different data attributes to display on the IP nodes in the map

The dashboard should contain at least 1 of the following widgets but the more that are defined will help differentiate the candidate:

1.	A stacked bar chart using the D3.JS library.  The bar chart will display counts for each data category associated with each IP.
2.	A tabular display showing the data category counts.  Display by descending sort in the following order: trojans, bots, spam.
3.	A map widget of the geographical location of the IPs.  Place pins for each IP on the map corresponding with the given lat/long coordinates.  Give each pin a tooltip displaying the IP and respective threat counts.

Use your choice of layout and styling to optimize experience for the user.

Provide all code, test cases and any additional test data via github or a tarball that allows our team to run the code in our environment.
