import json
import redis

# Create a Redis client
redis_client = redis.Redis(host='localhost', port=6379, db=0)

def get_from_redis_client(key: str):
    """Get data from Redis."""
    data = redis_client.get(key)
    if data:
        return json.loads(data)
    return None

def save_to_redis_client(key: str, data: dict):
    """Save ticker and name from data to Redis."""
    with redis_client.pipeline() as pipe:
        pipe.set(key, json.dumps(data))
        pipe.expire(key, 3600)  # Expire after 1 hour
        pipe.execute()

def delete_from_redis_client(key: str):
    """Delete data from Redis."""
    redis_client.delete(key)
