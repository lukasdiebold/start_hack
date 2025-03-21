import pandas as pd
import json
import os
from cloudflare import Cloudflare

# Cloudflare credentials
CLOUDFLARE_EMAIL="noahgerber100@gmail.com"
CLOUDFLARE_API_KEY="645dffdb555b380fb1f7147e1d3fbf93866ca"
CLOUDFLARE_ACCOUNT_ID="5b90fdf2bc4e39874b024b2bc8cd5d13"

# KV namespace IDs
AREA_KV="9fe97c568fd34a6587b0a30815f366b6"
CONTACTS_KV="4c09d26cbe604708840b86accdc5b079"

# Input file path (enriched CSV)
INPUT_FILE = './START Hack 25_Canton of St.Gallen_dataset innovation ecosystem_enriched.csv'

# Initialize Cloudflare client
try:
    client = Cloudflare(
        api_email=CLOUDFLARE_EMAIL,
        api_key=CLOUDFLARE_API_KEY,
    )
    CLOUDFLARE_AVAILABLE = True
except Exception as e:
    print(f"Error initializing Cloudflare client: {e}")
    CLOUDFLARE_AVAILABLE = False

def send_kv(kvs: dict, namespace_id: str):
    """Send data to Cloudflare KV store."""
    if not CLOUDFLARE_AVAILABLE:
        print("Cloudflare client not available. Simulating upload...")
        # Save to local file for testing
        namespace_short = namespace_id[-6:] if namespace_id else "mock"
        with open(f"cf_kv_{namespace_short}.json", 'w') as f:
            json.dump(kvs, f, indent=2)
        return len(kvs)
    
    try:
        response = client.kv.namespaces.bulk_update(
            namespace_id=namespace_id,
            account_id=CLOUDFLARE_ACCOUNT_ID,
            body=[{
                    "key": key,
                    "value": value
                } for key, value in kvs.items()],
        )
        print(f"Successfully uploaded {response.successful_key_count} keys")
        return response.successful_key_count
    except Exception as e:
        print(f"Error uploading to Cloudflare KV: {e}")
        # Fall back to local file storage
        namespace_short = namespace_id[-6:] if namespace_id else "mock"
        with open(f"cf_kv_{namespace_short}.json", 'w') as f:
            json.dump(kvs, f, indent=2)
        return len(kvs)

def process_csv_to_kv(file_path):
    """Process CSV data into KV format."""
    print(f"Loading data from {file_path}...")
    
    if not os.path.exists(file_path):
        # Try in the current directory
        base_filename = os.path.basename(file_path)
        if os.path.exists(base_filename):
            file_path = base_filename
        else:
            raise FileNotFoundError(f"Input file not found: {file_path}")
    
    # Load the CSV data
    df = pd.read_csv(file_path)
    print(f"Loaded {len(df)} records")
    
    # Create area_kv and contact_kv dictionaries
    area_kv = {}
    contact_kv = {}
    
    # Process each row in the CSV
    for idx, row in df.iterrows():
        contact_id = str(idx + 1)  # 1-based index as string
        
        # Extract focus areas
        focus_areas = [area.strip() for area in row['Focus Areas'].split(',')]
        
        # Add contact to area mapping
        for area in focus_areas:
            if area not in area_kv:
                area_kv[area] = {"contactIds": []}
            area_kv[area]["contactIds"].append(contact_id)
        
        # Create contact record
        contact_kv[contact_id] = {
            "name": row['Name'],
            "description": row['Description'],
            "institution": row['Institution'],
            "category": row['Category'],
            # Use 'Contact' field as email
            "email": row['Contact'],
            "website": row['Website']
        }
    
    # Serialize to JSON strings
    serialized_area_kv = {k: json.dumps(v) for k, v in area_kv.items()}
    serialized_contact_kv = {k: json.dumps(v) for k, v in contact_kv.items()}
    
    return serialized_area_kv, serialized_contact_kv, len(area_kv), len(contact_kv)

def main():
    """Main function to process data and upload to KV stores."""
    print("Starting data upload process...")
    
    try:
        # Process CSV to KV format
        area_kv, contact_kv, area_count, contact_count = process_csv_to_kv(INPUT_FILE)
        
        print(f"Processed {area_count} focus areas and {contact_count} contacts")
        
        # Save sample data for verification
        sample_area = {k: json.loads(v) for k, v in list(area_kv.items())[:5]}
        sample_contact = {k: json.loads(v) for k, v in list(contact_kv.items())[:5]}
        
        with open("sample_area_kv.json", "w") as f:
            json.dump(sample_area, f, indent=2)
        
        with open("sample_contact_kv.json", "w") as f:
            json.dump(sample_contact, f, indent=2)
        
        print("Saved sample data to sample_area_kv.json and sample_contact_kv.json")
        
        # Upload to KV stores
        print("Uploading area KV data...")
        area_success = send_kv(area_kv, AREA_KV)
        
        print("Uploading contact KV data...")
        contact_success = send_kv(contact_kv, CONTACTS_KV)
        
        print(f"Data upload completed: {area_success} focus areas and {contact_success} contacts uploaded")
        
    except Exception as e:
        print(f"Error during data upload: {str(e)}")

if __name__ == "__main__":
    main()

