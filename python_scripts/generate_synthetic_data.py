import pandas as pd
import numpy as np
import os
import re
import json
import openai
import random
from collections import Counter, defaultdict


# Get API key from environment variable
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

# Initialize OpenAI client
client = openai.OpenAI(api_key=api_key)

def load_and_process_data(file_path):
    """Load and process the CSV data to extract focus areas and current coverage."""
    # Read the CSV file
    df = pd.read_csv(file_path)
    
    # Extract all individual focus areas
    all_focus_areas = []
    focus_to_people = defaultdict(list)
    
    for idx, row in df.iterrows():
        # Get institution name and contact
        institution = row['Institution']
        contact = row['Contact']
        name = row['Name']
        
        # Split focus areas
        focus_list = [area.strip() for area in row['Focus Areas'].split(',')]
        all_focus_areas.extend(focus_list)
        
        # Map focus areas to existing contacts
        for area in focus_list:
            focus_to_people[area].append({
                'institution': institution,
                'name': name,
                'contact': contact
            })
    
    # Get unique focus areas
    unique_focus_areas = sorted(set(all_focus_areas))
    
    # Count focus area frequencies
    focus_counts = Counter(all_focus_areas)
    
    # Get average number of focus areas per person
    avg_focus_areas = len(all_focus_areas) / len(df)
    
    # Get the distribution of institution types
    institution_counts = df['Institution'].value_counts()
    
    return df, unique_focus_areas, focus_counts, focus_to_people, avg_focus_areas, institution_counts

def identify_underrepresented_areas(focus_to_people, min_people=3):
    """Identify focus areas with fewer than the minimum number of people."""
    underrepresented = {}
    
    for area, people in focus_to_people.items():
        if len(people) < min_people:
            underrepresented[area] = min_people - len(people)
    
    return underrepresented

def generate_name_bank(size=100):
    """Generate a bank of realistic Swiss/European names using OpenAI."""
    prompt = """
    Generate a list of 100 realistic Swiss and European full names (first name and last name).
    The names should be diverse in gender and origin within European countries.
    
    Format the response as a JSON array of objects, each with 'first_name' and 'last_name' fields.
    Example:
    [
        {"first_name": "Thomas", "last_name": "Müller"},
        {"first_name": "Anna", "last_name": "Schmidt"},
        ...
    ]
    """
    
    try:
        # Call the OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates realistic synthetic data for research purposes."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        # Extract the JSON from the response
        response_text = response.choices[0].message.content.strip()
        
        # Find JSON in the response
        json_match = re.search(r'(\[[\s\S]*\])', response_text)
        if json_match:
            json_str = json_match.group(1)
            try:
                names_data = json.loads(json_str)
                return names_data
            except json.JSONDecodeError:
                print("Failed to parse JSON for names. Falling back to manual name generation.")
        
    except Exception as e:
        print(f"Error generating names with AI: {str(e)}")
    
    # Fallback to manual name generation
    return generate_manual_name_bank(size)

def generate_manual_name_bank(size=100):
    """Generate a bank of names manually as fallback."""
    # Swiss/German/European first names
    first_names = [
        # Male names
        "Andreas", "Thomas", "Michael", "Stefan", "Daniel", "Lukas", "Hans", "Peter", 
        "Martin", "Klaus", "Franz", "Matthias", "Jürgen", "Wolfgang", "Christoph",
        "Felix", "Marc", "Florian", "David", "Markus", "Urs", "Beat", "Reto", "René",
        "Johan", "Erik", "Pierre", "Carlo", "Luca", "Giovanni", "Francesco", "Paolo",
        # Female names
        "Christine", "Anna", "Maria", "Franziska", "Laura", "Eva", "Sophie", "Lisa",
        "Claudia", "Julia", "Sabine", "Monika", "Heidi", "Ursula", "Brigitte", "Silvia",
        "Elisa", "Martina", "Sandra", "Nicole", "Simone", "Katharina", "Melanie", "Petra",
        "Ingrid", "Charlotte", "Isabelle", "Marie", "Céline", "Sofia", "Giulia", "Chiara"
    ]
    
    # Swiss/European last names
    last_names = [
        "Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker", 
        "Hoffmann", "Schulz", "Brunner", "Keller", "Huber", "Gerber", "Widmer", "Zimmermann",
        "Schmid", "Steiner", "Baumann", "Hofer", "Meier", "Lehmann", "Schmitt", "Roth", "Beck",
        "Berger", "Schwarz", "Klein", "Suter", "Frei", "Bucher", "Egger", "Wyss", "Wirth",
        "Dubois", "Leroy", "Moreau", "Fournier", "Girard", "Lefebvre", "Bonnet", "Laurent",
        "Rossi", "Ferrari", "Esposito", "Bianchi", "Romano", "Colombo", "Ricci", "Marino",
        "Jensen", "Nielsen", "Andersen", "Larsen", "Jorgensen", "Petersen", "Kristensen",
        "Gonzalez", "Rodriguez", "Fernandez", "Lopez", "Martinez", "Garcia", "Sanchez"
    ]
    
    # Generate random name combinations
    name_bank = []
    for _ in range(size):
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        name_bank.append({"first_name": first_name, "last_name": last_name})
    
    return name_bank

def generate_institution_bank(original_institutions, size=50):
    """Generate a bank of institutions based on existing ones and new ones."""
    prompt = f"""
    Generate a list of 50 realistic institution names in the St. Gallen region of Switzerland.
    Include universities, research centers, companies, and other organizations related to innovation and research.
    Some of these should be variations or departments of existing institutions, and others should be new but realistic.
    
    Here are some existing institutions from the dataset to use as reference:
    {json.dumps(list(original_institutions.index[:10]))}
    
    Format the response as a JSON array of objects, each with 'name' and 'type' fields.
    Example:
    [
        {{"name": "Institute for Digital Innovation St. Gallen", "type": "Research"}},
        {{"name": "University of St.Gallen - Center for Leadership Studies", "type": "Academia"}},
        ...
    ]
    """
    
    try:
        # Call the OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates realistic synthetic data for research purposes."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        # Extract the JSON from the response
        response_text = response.choices[0].message.content.strip()
        
        # Find JSON in the response
        json_match = re.search(r'(\[[\s\S]*\])', response_text)
        if json_match:
            json_str = json_match.group(1)
            try:
                institutions_data = json.loads(json_str)
                # Add some of the original institutions to ensure we have good coverage
                for inst in original_institutions.index[:20]:
                    institutions_data.append({"name": inst, "type": "Original"})
                return institutions_data
            except json.JSONDecodeError:
                print("Failed to parse JSON for institutions. Falling back to manual generation.")
        
    except Exception as e:
        print(f"Error generating institutions with AI: {str(e)}")
    
    # Fallback to using original institutions
    institutions_data = []
    for inst in original_institutions.index:
        institutions_data.append({"name": inst, "type": "Original"})
    
    # Add some synthetic variations
    prefixes = ["Institute of", "Center for", "Department of", "Lab for", "Research Group on"]
    suffixes = ["Research", "Innovation", "Studies", "Applications", "Development"]
    domains = ["Digital", "Sustainable", "Economic", "Social", "Technological", "Medical", "Environmental"]
    
    for _ in range(size - len(institutions_data)):
        if random.random() < 0.5 and original_institutions.index.size > 0:
            # Create a variation of an existing institution
            base_inst = random.choice(original_institutions.index)
            prefix = random.choice(prefixes)
            domain = random.choice(domains)
            suffix = random.choice(suffixes)
            
            new_inst = f"{base_inst} - {prefix} {domain} {suffix}"
        else:
            # Create a new institution
            prefix = random.choice(prefixes)
            domain = random.choice(domains)
            suffix = random.choice(suffixes)
            
            new_inst = f"{prefix} {domain} {suffix} St.Gallen"
        
        institutions_data.append({"name": new_inst, "type": "Synthetic"})
    
    return institutions_data

def generate_related_focus_areas(main_focus, all_focus_areas, avg_related=2):
    """Generate a list of related focus areas to combine with the main focus area."""
    # Ensure main_focus is a string
    main_focus = str(main_focus)
    
    # Categories of focus areas for better grouping of related areas
    focus_categories = {
        'technology': ['Technology', 'Digital', 'Engineering', 'Software', 'IT', 'Robotics', 'Automation', 'Manufacturing'],
        'business': ['Business', 'Management', 'Strategy', 'Leadership', 'Corporate', 'Organization'],
        'finance': ['Finance', 'Banking', 'Financial', 'Economic', 'Economics', 'Investment'],
        'healthcare': ['Health', 'Medical', 'Healthcare', 'Nursing', 'Medicine', 'Clinical'],
        'sustainability': ['Sustainable', 'Environment', 'Climate', 'Renewable', 'Recycling'],
        'social': ['Social', 'Society', 'Ethics', 'Philosophy', 'Inclusion'],
        'innovation': ['Innovation', 'Research', 'Development', 'Product', 'Process'],
        'law': ['Law', 'Legal', 'Compliance', 'Regulatory']
    }
    
    # Determine which category the main focus area belongs to
    main_category = None
    for category, keywords in focus_categories.items():
        if any(keyword.lower() in main_focus.lower() for keyword in keywords):
            main_category = category
            break
    
    # Filter focus areas that might be related
    related_candidates = []
    
    if main_category:
        # Find other focus areas in the same category
        for area in all_focus_areas:
            # Ensure area is a string
            str_area = str(area)
            if str_area != main_focus and any(keyword.lower() in str_area.lower() for keyword in focus_categories[main_category]):
                related_candidates.append(str_area)
    
    # If we didn't find enough related areas, add some random ones
    if len(related_candidates) < avg_related:
        # Add random areas that are not the main focus
        other_areas = [str(area) for area in all_focus_areas if str(area) != main_focus and str(area) not in related_candidates]
        random_count = min(avg_related - len(related_candidates), len(other_areas))
        if random_count > 0:
            related_candidates.extend(random.sample(other_areas, random_count))
    
    # Select a random number of related areas (1-3)
    num_related = random.randint(1, min(3, len(related_candidates)))
    if related_candidates and num_related > 0:
        return random.sample(related_candidates, num_related)
    
    return []

def generate_email_from_name_and_institution(first_name, last_name, institution):
    """Generate a realistic email address based on name and institution."""
    # Format first and last name for email
    email_first = first_name.lower().replace(" ", ".")
    email_last = last_name.lower().replace(" ", ".")
    
    # Clean institution name for domain
    domain = institution.lower().replace(" ", "").replace("(", "").replace(")", "").replace(",", "")
    domain = re.sub(r'[^a-z0-9]', '', domain)
    
    # Format domain properly based on institution type
    if "university" in domain or "unisg" in domain:
        domain = "unisg.ch"
    elif "applied" in domain or "ost" in domain:
        domain = "ost.ch"
    elif "kantonsspital" in domain or "hospital" in domain:
        domain = "kssg.ch"
    elif "empa" in domain:
        domain = "empa.ch"
    elif "research" in domain or "institute" in domain:
        domain = f"{domain[:8]}.ch"
    else:
        # Create a simplified domain
        parts = institution.lower().split()
        if len(parts) > 1:
            # Use first word or first letter of each word
            if len(parts[0]) > 3:
                domain = f"{parts[0]}.ch"
            else:
                domain = f"{''.join([p[0] for p in parts if p[0].isalpha()])}.ch"
        else:
            domain = f"{domain[:8]}.ch"
    
    # Different email formats with probabilities
    email_formats = [
        (0.4, f"{email_first}.{email_last}@{domain}"),               # first.last@domain
        (0.2, f"{email_first[0]}.{email_last}@{domain}"),            # f.last@domain
        (0.2, f"{email_first}@{domain}"),                            # first@domain
        (0.1, f"{email_first[0]}{email_last}@{domain}"),             # flast@domain
        (0.1, f"{email_last}.{email_first[0]}@{domain}")             # last.f@domain
    ]
    
    # Choose an email format based on probabilities
    formats = [f for p, f in email_formats]
    probabilities = [p for p, f in email_formats]
    
    return random.choices(formats, probabilities)[0]

def generate_website_from_institution(institution):
    """Generate a website URL from institution name."""
    # Clean institution name for URL
    domain = institution.lower().replace(" ", "").replace("(", "").replace(")", "").replace(",", "")
    domain = re.sub(r'[^a-z0-9]', '', domain)
    
    # Format domain properly based on institution type
    if "university" in domain or "unisg" in domain:
        return "https://www.unisg.ch"
    elif "applied" in domain or "ost" in domain:
        return "https://www.ost.ch"
    elif "kantonsspital" in domain or "hospital" in domain:
        return "https://www.kssg.ch"
    elif "empa" in domain:
        return "https://www.empa.ch"
    elif "innosuisse" in domain:
        return "https://www.innosuisse.ch"
    else:
        # Create a simplified domain
        parts = institution.lower().split()
        if len(parts) > 1:
            # Use first word or first letter of each word
            if len(parts[0]) > 3:
                return f"https://www.{parts[0]}.ch"
            else:
                simplified = ''.join([p[0] for p in parts if p[0].isalpha()])
                return f"https://www.{simplified}.ch"
        else:
            simplified = domain[:8] if len(domain) > 8 else domain
            return f"https://www.{simplified}.ch"

def generate_synthetic_description(focus_areas, institution):
    """Generate a realistic description based on focus areas and institution."""
    # Ensure all focus areas are strings
    focus_areas = [str(area) for area in focus_areas]
    
    # Simple template-based approach
    templates = [
        "Research and teaching in {focus_list}, with a special emphasis on {primary_focus}.",
        "Experts in {primary_focus} with additional focus on {secondary_focus_list}.",
        "Providing expertise in {focus_list} through research, education, and innovation.",
        "Advancing knowledge and applications in {focus_list}, particularly {primary_focus}.",
        "Specializing in {primary_focus} with complementary work in {secondary_focus_list}.",
        "Research group focused on {primary_focus}, also exploring {secondary_focus_list}.",
        "Studies and innovations in {focus_list}, with primary emphasis on applications in {primary_focus}.",
        "Developing solutions in {primary_focus} while conducting research on {secondary_focus_list}."
    ]
    
    primary_focus = focus_areas[0]
    
    if len(focus_areas) > 1:
        secondary_focus_list = ", ".join(focus_areas[1:])
        focus_list = ", ".join(focus_areas)
        
        template = random.choice(templates)
        description = template.format(
            primary_focus=primary_focus,
            secondary_focus_list=secondary_focus_list,
            focus_list=focus_list
        )
    else:
        # Single focus area
        templates = [
            f"Research and teaching in {primary_focus}.",
            f"Experts in {primary_focus} applications and methodologies.",
            f"Providing expertise in {primary_focus} through research and innovation.",
            f"Advancing knowledge and applications in {primary_focus}.",
            f"Specializing in {primary_focus} research and development."
        ]
        description = random.choice(templates)
    
    return description

def assign_category_based_on_institution(institution_name):
    """Assign a category based on the institution name."""
    institution_lower = institution_name.lower()
    
    if any(term in institution_lower for term in ['university', 'hochschule', 'school', 'college']):
        return 'Academia'
    elif any(term in institution_lower for term in ['institute', 'research', 'lab', 'center', 'centre']):
        return 'Research'
    elif any(term in institution_lower for term in ['hospital', 'clinic', 'medical', 'health']):
        return 'Research'
    elif any(term in institution_lower for term in ['fund', 'invest', 'capital', 'finance']):
        return 'Funding'
    elif any(term in institution_lower for term in ['association', 'verband', 'society']):
        return 'Association'
    elif any(term in institution_lower for term in ['network', 'alliance', 'consortium']):
        return 'Network'
    elif any(term in institution_lower for term in ['canton', 'city', 'state', 'federal', 'government']):
        return 'Government'
    else:
        # Default to most common category if unsure
        return random.choice(['Research', 'Network', 'Academia'])

def generate_synthetic_data(file_path, output_path, min_people_per_focus=3):
    """Main function to generate synthetic data with multiple focus areas per person."""
    print("Loading and processing original data...")
    df, unique_focus_areas, focus_counts, focus_to_people, avg_focus_areas, institution_counts = load_and_process_data(file_path)
    
    # Round up average focus areas to ensure good coverage
    avg_focus_areas = round(avg_focus_areas + 0.5)
    print(f"Average focus areas per person in original data: {avg_focus_areas}")
    
    # Identify underrepresented focus areas
    underrepresented = identify_underrepresented_areas(focus_to_people, min_people_per_focus)
    print(f"Found {len(underrepresented)} underrepresented focus areas out of {len(unique_focus_areas)} total areas")
    
    # Generate banks of names and institutions
    print("Generating bank of synthetic names...")
    name_bank = generate_name_bank(size=200)
    print(f"Generated {len(name_bank)} synthetic names")
    print(name_bank)
    
    print("Generating bank of institutions...")
    institution_bank = generate_institution_bank(institution_counts, size=100)
    print(f"Generated {len(institution_bank)} institutions")
    
    # Now we'll group underrepresented areas to create more realistic people
    # with multiple focus areas
    focus_groups = []
    remaining_areas = list(underrepresented.keys())
    random.shuffle(remaining_areas)
    
    # First pass: assign primary focus areas to records
    while remaining_areas:
        main_focus = remaining_areas.pop(0)
        related_focuses = generate_related_focus_areas(main_focus, unique_focus_areas, avg_focus_areas - 1)
        
        # Remove any related focus areas that are in the remaining areas list
        # to avoid duplication and ensure coverage
        for related in list(related_focuses):
            if related in remaining_areas:
                remaining_areas.remove(related)
        
        focus_groups.append([main_focus] + related_focuses)
    
    # Create synthetic records
    synthetic_records = []
    print("Generating synthetic records...")
    
    # Keep track of how many people we've assigned to each focus area
    assigned_people_count = {area: len(people) for area, people in focus_to_people.items()}
    
    # Process each focus group
    for focus_group in focus_groups:
        main_focus = focus_group[0]  # Primary focus area
        needed = underrepresented.get(main_focus, 0)
        
        if needed <= 0:
            continue  # Skip if we don't need more people for this area
        
        print(f"Generating {needed} synthetic people for main focus: {main_focus}")
        
        for i in range(needed):
            try:
                # Get a name from the name bank
                name_data = random.choice(name_bank)
                full_name = f"{name_data['first_name']} {name_data['last_name']}"
                
                # Get an institution from the institution bank, with some preference 
                # for institutions that match the focus area
                matching_institutions = [
                    inst for inst in institution_bank 
                    if any(focus.lower() in inst['name'].lower() for focus in focus_group)
                ]
                
                if matching_institutions and random.random() < 0.7:
                    # 70% chance to use a matching institution
                    institution_data = random.choice(matching_institutions)
                else:
                    # 30% chance to use any institution
                    institution_data = random.choice(institution_bank)
                
                institution_name = institution_data['name']
                
                # Generate contact and website
                email = generate_email_from_name_and_institution(
                    name_data['first_name'], name_data['last_name'], institution_name
                )
                website = generate_website_from_institution(institution_name)
                
                # Generate a description
                description = generate_synthetic_description(focus_group, institution_name)
                
                # Assign a category based on institution
                category = assign_category_based_on_institution(institution_name)
                
                # Create a record matching the original DataFrame structure
                # Ensure all focus areas are strings before joining
                str_focus_group = [str(focus) for focus in focus_group]
                
                record = {
                    'Category': category,
                    'Institution': institution_name,
                    'Name': full_name,
                    'Description': description,
                    'Focus Areas': ', '.join(str_focus_group),
                    'Contact': email,
                    'Website': website
                }
                
                synthetic_records.append(record)
                print(f"  Generated: {full_name} at {institution_name} with focuses: {', '.join(str_focus_group)}")
                
                # Update the count of people assigned to each focus area
                for focus in focus_group:
                    assigned_people_count[focus] = assigned_people_count.get(focus, 0) + 1
                
            except Exception as e:
                print(f"Error generating person for {main_focus}: {str(e)}")
                # print trace of the error
                import traceback
                traceback.print_exc()
    
    # Create DataFrame with synthetic records
    synthetic_df = pd.DataFrame(synthetic_records)
    
    # Combine original and synthetic data
    combined_df = pd.concat([df, synthetic_df], ignore_index=True)
    
    # Save the combined dataset
    combined_df.to_csv(output_path, index=False)
    print(f"Generated {len(synthetic_records)} synthetic records")
    print(f"Combined dataset with {len(combined_df)} records saved to {output_path}")
    
    # Return statistics for verification
    focus_coverage = {}
    for area in unique_focus_areas:
        # Convert area to string to ensure safe comparison
        str_area = str(area)
        # Use regex pattern to handle the area as a whole word in Focus Areas
        pattern = r'(^|,\s*)' + re.escape(str_area) + r'(\s*,|$)'
        area_records = combined_df[combined_df['Focus Areas'].str.contains(pattern, regex=True)]
        focus_coverage[str_area] = len(area_records)
    
    return {
        'original_records': len(df),
        'synthetic_records': len(synthetic_records),
        'total_records': len(combined_df),
        'focus_areas': len(unique_focus_areas),
        'underrepresented_areas': len(underrepresented),
        'focus_coverage': focus_coverage
    }

if __name__ == "__main__":
    input_file = 'START Hack 25_Canton of St.Gallen_dataset innovation ecosystem_enriched.csv'
    output_file = 'START Hack 25_Canton of St.Gallen_dataset innovation ecosystem_enriched_new.csv'
    
    stats = generate_synthetic_data(input_file, output_file, min_people_per_focus=3)
    
    print("\nSummary Statistics:")
    print(f"Original Records: {stats['original_records']}")
    print(f"Synthetic Records Added: {stats['synthetic_records']}")
    print(f"Total Records in New Dataset: {stats['total_records']}")
    print(f"Focus Areas: {stats['focus_areas']}")
    print(f"Previously Underrepresented Areas: {stats['underrepresented_areas']}")
    
    # Check if any areas still have fewer than the minimum number of people
    still_underrepresented = [str(area) for area, count in stats['focus_coverage'].items() if count < 3]
    if still_underrepresented:
        print(f"\nWarning: {len(still_underrepresented)} focus areas still have fewer than 3 associated people:")
        for area in still_underrepresented[:5]:  # Show just the first 5 if there are many
            print(f"  - {area}: {stats['focus_coverage'][str(area)]} people")
        if len(still_underrepresented) > 5:
            print(f"  - ... and {len(still_underrepresented) - 5} more")
    else:
        print("\nSuccess! All focus areas now have at least 3 associated people.")