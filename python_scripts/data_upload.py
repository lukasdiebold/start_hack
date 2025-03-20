from cloudflare import Cloudflare

CLOUDFLARE_EMAIL="noahgerber100@gmail.com"
CLOUDFLARE_API_KEY="645dffdb555b380fb1f7147e1d3fbf93866ca"
CLOUDFLARE_ACCOUNT_ID="5b90fdf2bc4e39874b024b2bc8cd5d13"

AREA_KV="9fe97c568fd34a6587b0a30815f366b6"
CONTACTS_KV="4c09d26cbe604708840b86accdc5b079"



client = Cloudflare(
    api_email=CLOUDFLARE_EMAIL,
    api_key=CLOUDFLARE_API_KEY,
)

def send_kv(kvs: dict, namespace_id: str):
    response = client.kv.namespaces.bulk_update(
        namespace_id=namespace_id,
        account_id=CLOUDFLARE_ACCOUNT_ID,
        body=[{
                "key": key,
                "value": value
            } for key, value in kvs.items()],
    )
    print(response.successful_key_count)
    return response.successful_key_count


