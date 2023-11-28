import requests
import tweepy
from Config.config import (TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET,
                           TWITTER_BEARER_TOKEN, TWITTER_CONSUMER_KEY,
                           TWITTER_CONSUMER_SECRET)

client = tweepy.Client(bearer_token=TWITTER_BEARER_TOKEN,
                       consumer_key=TWITTER_CONSUMER_KEY,
                       consumer_secret=TWITTER_CONSUMER_SECRET,
                       access_token=TWITTER_ACCESS_TOKEN,
                       access_token_secret=TWITTER_ACCESS_TOKEN_SECRET,
                       return_type=requests.Response,
                       wait_on_rate_limit=True)

def tweet_post(text):
    """Post a tweet with the given text."""
    try:
        response = client.create_tweet(text=text)
        response.raise_for_status()  # Raises a HTTPError if the status is 4xx, 5xx
        return response.json()
    except requests.exceptions.HTTPError as errh:
        print ("Http Error:",errh)
    except requests.exceptions.ConnectionError as errc:
        print ("Error Connecting:",errc)
    except requests.exceptions.Timeout as errt:
        print ("Timeout Error:",errt)
    except requests.exceptions.RequestException as err:
        print ("Something went wrong",err)

def tweet_delete(id):
    """Delete a tweet with the given id."""
    try:
        response = client.delete_tweet(id)
        response.raise_for_status()  # Raises a HTTPError if the status is 4xx, 5xx
        return response.json()
    except requests.exceptions.HTTPError as errh:
        print ("Http Error:",errh)
    except requests.exceptions.ConnectionError as errc:
        print ("Error Connecting:",errc)
    except requests.exceptions.Timeout as errt:
        print ("Timeout Error:",errt)
    except requests.exceptions.RequestException as err:
        print ("Something went wrong",err)