FlexLiving Reviews Dashboard

Overview:

The FlexLiving Reviews Dashboard is a full-stack web application built to help property managers understand and visualize guest feedback data more effectively.
It connects to the Hostaway API to gather real-world review data and presents it through a clean, interactive dashboard. The app highlights trends in ratings, sentiment patterns, and guest satisfaction insights using modern data visualization tools.
By combining a FastAPI backend for data processing with a React + Tailwind CSS frontend, the dashboard provides a smooth, intuitive experience — helping users quickly identify what iss working well and where improvements are needed.



Tech stack
Layer	                  Technology	                                                            Purpose
Frontend	              React (Vite) + Tailwind CSS	                                            Develops an interactive user interface and charts
Backend	                Python (FastAPI)	                                                      Handles data fetching and normalization through API layer
Data Source	            Hostaway API (used mock data as Hostaway access was forbidden/expired)	Ingests JSON and simulates real-world data
Visualization	          Recharts	                                                              Displays trend and sentiment analysis
Deployment	            Render (Free)	                                                          Hosts both frontend and backend in the cloud
Environment Management	dotenv	                                                                Loads and manages API keys securely
Middleware	            CORS	                                                                  Enables communication between frontend and backend

Key Design and Logic Decisions

Frontend and Backend

To make things easier to maintain, the project was specifically separated into two distinct sections: a frontend and a backend.
The backend, developed on FastAPI, will be used to communicate with the Hostaway API, clean and format the data on the reviews, and provide it via a simple /api/reviews endpoint.
The user-facing interface is the frontend, which is a React-based interface that considers solely the user. It retrieves the information in the backend and transforms it into an interactive dashboard and charts, filters, and sentiment overviews.
This division enables the system to be modular in that the backend can develop without the frontend changing its design and visualisation, and the frontend may also enhance its design and visualisation without impacting data processing.

Data normalization

The raw information provided by Hostaway API is rather complicated; it contains a nest of fields and a deep level of categorization ratings of each review.
To simplify the working with, the backend (FastAPI) works with this data and flattens it and then sends it to the frontend. It takes an average value of each review through a sum of the values under reviewCategory. Thereafter, it gives it a sentiment label depending on that score.
Yes when the mean rating is 8 or more,
Neutral if it’s between 6 and 8,
Negative otherwise.
This preprocessing step makes sure that there is always clean structured and analysis ready data fed into the frontend.

Fallback Mechanism

In case the connection to Hostaway API is lost. e.g. by invalid credentials or network problems the app does not crash. Rather it will automatically switch to a local mock_reviews.json file that will replicate the format of API response. This backup renders the dashboard trustworthy and testable so that the interface will never display nothing when the API is not active to support demos or testing.

Dynamic Environment Routing.

Its frontend was implemented in a way that it senses and reacts to its environment.
Locally it interacts with the local FastApi backend (http:127.0.0.1:8000).
However, after deployment, it will automatically be configured to go to the Render backend URL (https://flexliving-backend-x1wz.onrender.com).
This allows the production to development process to be smooth and avoids hardcoding cross environment problems.

CORS Configuration

Since the front and backend are served on different URLs on Render, Web browser security would otherwise prohibit communications between the two.
As a solution, CORS (Cross-Origin Resource Sharing) middleware was included in the backend settings.
It is safe in accepting requests of any origin:

app.add_middleware(
CORSMiddleware,
allow_origins=["*"],
allow_methods=["*"],
allow_headers=["*"],
)
This will make the frontend be able to invoke the API arbitrarily at the local and deployed environments.

UI/UX Design

The dashboard is made simple to use, clean and informative to the eye. It shows four major summary cards such as Average Rating, Positive, Neutral, and Negative numbers then a comprehensive table of the guest reviews.  

Visualizations include:  
A trend chart that indicates the way ratings vary with time, and  an overview of the positive, neutral, and negative feedback as a percentage.  
It also has the Dark Mode which remembers the preference of the user with the help of localStorage. 
It is responsive, which implies that it is fluid to mobile, tablet, or desktop screens and was built with the help of Tailwind CSS.

Insight Logic

To give the data a more meaningful meaning, the dashboard will automatically determine the general sentiment and performance trends:  
When the average ratings are increasing beyond 0.5: it indicates 📈 Improving.  
When the ratings are decreasing by over 0.5: it displays 📉 Falling.  
Otherwise: it stays ➡️ Stable  
It also interprets the dispersion of sentiments to represent a summary in totality such as: The overall positive, needs improvement, or balanced allow users a brief feel of the pulse regarding how the guests feel.

API behavior:

Endpoint	     Method	 Description	                Example Response
/	             GET	   Health check for API status	{ "message": "FlexLiving Reviews API running 🚀" }
/api/reviews/	 GET	   Returns structured review data including listing, guest, rating, sentiment, and submission date

Example Response:

{
  "status": "success",
  "reviews": [
    {
      "id": 7453,
      "listing": "2B N1 A - 29 Shoreditch Heights",
      "guest": "Shane Finkelstein",
      "avg_rating": 9.7,
      "review_text": "Shane and family are wonderful!",
      "sentiment": "Positive",
      "submitted_at": "2020-08-21 22:45:14"
    },
    {
      "id": 7454,
      "listing": "1A Soho Loft",
      "guest": "Lucy Brown",
      "avg_rating": 7.5,
      "review_text": "Great location but could be cleaner.",
      "sentiment": "Neutral",
      "submitted_at": "2020-09-02 12:15:00"
    }
  ]
}

Behavior Summary:

Pulls reviews from live Hostaway API when credentials are available.
Fallbacks to mock_reviews.json if the API call fails.
Returns normalized and sentiment-tagged JSON for the frontend.


Findings of Google Reviews (Optional Extension)  

This version of the dashboard is as of now purely devoted to Hostaway reviews in order to have consistency and reliability. Nonetheless, the system is extensible in nature i.e. it can very easily accommodate other review sources in future upgrades like Google Reviews.  
In order to have Google Reviews, one would only need several steps more:  
Create a new API endpoint (e.g., app/routers/google_reviews.py) to get and process Google review data.  Combine Hostaway and Google data feeds in the transformation layer of the backend.  
Expand the frontend charts with the sentiment trends and average rating across platforms.  
This functionality is omitted in this submission because of the access restrictions of Google API key, though the architecture is already capable of a multi-source review analytic pipeline when this access is available.


Running version or local setup instructions

Live Session is Accessible here:
Frontend: https://flexliving-reviews-dashboard-zg9s.onrender.com
Backend: https://flexliving-backend-x1wz.onrender.com/api/reviews
GitHub Source: https://github.com/Vamshi130899/flexliving-reviews-dashboard
Generally, both live session and local setup uses the Hostaway API or the fallback mock data.

Local Setup Instructions:
To run the frontend and backend in local:

1.clone the Git repository provided:
git clone https://github.com/<your-username>/flexliving-reviews-dashboard.git
cd flexliving-reviews-dashboard

2. FastAPI Setup ( backend):
cd backend
python -m venv venv
venv\Scripts\activate (windows)
or source venv/bin/activate  (Mac/Linux)
pip install -r requirements.txt
After that create a .env file in the backend/ :
HOSTAWAY_API_URL=https://api.hostaway.com/v1/reviews
HOSTAWAY_API_KEY=<your_api_key>
HOSTAWAY_ACCOUNT_ID=<your_account_id>
Then run the backend server:
uvicorn app.main:app --reload --port 8000
After running the above command the backend will start working at this: http://127.0.0.1:8000/api/reviews/

3. React and Vite Setup (Frontend):
cd ../frontend
npm install
npm run dev
After running the above command the frontend will start working at this: http://localhost:5173/
Once running all these commands is done just verify the connection by clicking the above links 
The data which is present is visible locally.
Auto Routing between the environments is implemented for the both backend and frontend to work locally as well as in the production i.e., produced in the Render.




