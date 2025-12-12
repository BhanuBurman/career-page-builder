AGENT_LOG
=========

Prompts for understanding the requriements and possible solutions
----------------------------------
- this is the full description and iwant to use here the fastapi and reactjs,
explain here the each steps and tell me my focus area adn suggest how to do that
- herer what would be the frotnedf page ? like fo candidate and recrutire then what would be user flow here
- is using jsonb scalable approach ? why explain
- here min_salary and max_salary should be eitehr flow or doubl rihgt ?
- I need to perform the schema validation also give me a brief idea



Wanted to understand in more depth about company slug architecture
-------------------------------
- Focus Area 2: The "Slug" Logic
Ensure your Database and API are designed around the slug.

- Why: This allows you to host multiple companies on one platform easily.
How: In FastAPI, almost every public endpoint should look like: @app.get("/public/{company_slug}/...").

- explain more about this slug logic, how to do that what all the best practice i should keep in mind



Some Database Confussion
-----------------
- here the dataabse is etrnign the entier job object containng all teh entried what is the way so that i can get the selective fields like only the title status, salay only not the full desictiojn and other fields ? wht will be the best optimized appraoch
- here i am using tow times is tehre any method to optimzie this ?


Other Error Causing prompts
-------------------------
- herer what would be the frotnedf page ? like fo candidate and recrutire then what would be user flow here

- SEO (Search Engine Optimization):

- Since React is client-side, use React Helmet.
Dynamically update the tags based on the Company Name fetched from the API.


- I want to make the login and register form using fastapi and react and supabase,
so in supabase there is also the functionalit yof oAuth right ?
and also sing the manaul usernme and password how to handle the both ?
how to do this

- @App.tsx (1-67) 
- remove all teh logic from here app, and move it to @AuthPage.tsx  in teh app there should only be caliing to pages, using react-rotuers, so use the react-router-dom

- this is using legacy anon key, but supabase has changed to publishable key and secret key right, tell me how to configure with this new setup

- here the dataabse is etrnign the entier job object containng all teh entried what is the way so that i can get the selective fields like only the title status, salay only not the full desictiojn and other fields ? wht will be the best optimized appraoch