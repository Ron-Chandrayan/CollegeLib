import os
import sys
from typing import Optional

from pymongo import MongoClient
from pymongo.collection import Collection

try:
    # Load environment variables from a .env file if present
    from dotenv import load_dotenv  # type: ignore

    load_dotenv()
except Exception:
    # python-dotenv is optional; environment may already be set
    pass


def get_mongo_client() -> MongoClient:
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        raise RuntimeError(
            "MONGO_URI not set. Please add it to your environment or a .env file."
        )
    return MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)


def get_collection(client: MongoClient, db_name: Optional[str] = None) -> Collection:
    """
    Returns the fe_students collection. If db_name is not provided, use the
    database encoded in the URI.
    """
    if db_name:
        db = client[db_name]
    else:
        # If database is specified in URI, client.get_default_database() may return it
        db = client.get_default_database()
        if db is None:
            raise RuntimeError(
                "No default database found in URI. Provide a database name explicitly."
            )
    return db["fe_students"]


def find_student_name_by_prn(collection: Collection, prn: str) -> Optional[str]:
    # Normalize PRN to uppercase as per app behavior
    normalized_prn = prn.strip().upper()
    if not normalized_prn:
        return None

    # Try exact match on PRN; create an index on PRN in DB for best performance
    doc = collection.find_one({"PRN": normalized_prn}, {"name": 1})
    if doc and isinstance(doc.get("name"), str):
        return doc["name"]

    # Fallback: sometimes field could be lowercase or named differently
    # Try common alternatives without being too expensive
    doc = collection.find_one({"prn": normalized_prn}, {"name": 1})
    if doc and isinstance(doc.get("name"), str):
        return doc["name"]

    return None


def main() -> int:
    # Accept PRN via CLI argument or interactive prompt
    if len(sys.argv) >= 2:
        input_prn = sys.argv[1]
    else:
        try:
            input_prn = input("Enter PRN: ")
        except KeyboardInterrupt:
            print("\nCancelled.")
            return 1

    try:
        client = get_mongo_client()
        collection = get_collection(client)
        name = find_student_name_by_prn(collection, input_prn)
        if name:
            print(f"Name: {name}")
            return 0
        else:
            print("No student found for given PRN.")
            return 2
    except Exception as exc:
        print(f"Error: {exc}")
        return 1
    finally:
        try:
            client.close()  # type: ignore[name-defined]
        except Exception:
            pass


if __name__ == "__main__":
    raise SystemExit(main())


 
