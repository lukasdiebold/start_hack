import csv
import os
from sqlalchemy import Column, ForeignKey, Integer, PrimaryKeyConstraint, create_engine
from sqlalchemy.orm import Session, declarative_base
from createDB import (
    SessionLocal, 
    InnovationAreas, 
    Experts,
    ExpertAreas,
    Base
)




def import_innovation_data(db: Session, csv_path: str):
    """
    Import innovation ecosystem data from CSV file into database
    
    Args:
        db: SQLAlchemy database session
        csv_path: Path to the CSV file
    """
    # Check if file exists
    if not os.path.exists(csv_path):
        print(f"Error: File {csv_path} not found")
        return
    
    print(f"Importing data from {csv_path}...")
    
    # Dictionary to track innovation areas
    innovation_areas = {}
    area_id = 1
    
    # First pass: Create all innovation areas
    with open(csv_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        for row in reader:
            # Extract focus areas
            if row['Focus Areas']:
                focus_areas = [area.strip() for area in row['Focus Areas'].split(',')]
                
                # Create innovation areas
                for area_name in focus_areas:
                    if area_name not in innovation_areas:
                        # Check if the area already exists in the database
                        existing_area = db.query(InnovationAreas).filter(
                            InnovationAreas.innovation_area_name == area_name
                        ).first()
                        
                        if existing_area:
                            innovation_areas[area_name] = existing_area.innovation_area_id
                        else:
                            # Create new innovation area
                            db_area = InnovationAreas(
                                innovation_area_id=area_id,
                                innovation_area_name=area_name
                            )
                            db.add(db_area)
                            innovation_areas[area_name] = area_id
                            area_id += 1
    
    # Commit innovation areas to get their IDs
    db.commit()
    
    # Second pass: Create experts and relationships
    with open(csv_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        for row in reader:
            category = row['Category']
            name = row['Name']
            institution = row['Institution']
            description = row['Description']
            email = row['Contact'] if 'Contact' in row else ''
            website = row['Website'] if 'Website' in row else ''
            
            # Extract first focus area as the main category
            expert_category = None
            if row['Focus Areas']:
                first_area = row['Focus Areas'].split(',')[0].strip()
                if first_area in innovation_areas:
                    expert_category = innovation_areas[first_area]
            
            # Create expert
            db_expert = Experts(
                expert_name=name,
                expert_description=description,
                expert_institution=institution,
                expert_email=email,
                expert_website=website
            )
            db.add(db_expert)
            db.flush()  # Flush to get the expert ID
            
            # Create relationships with all focus areas
            if row['Focus Areas']:
                focus_areas = [area.strip() for area in row['Focus Areas'].split(',')]
                for area_name in focus_areas:
                    if area_name in innovation_areas:
                        # Create many-to-many relationship
                        expert_area = ExpertAreas(
                            expert_id=db_expert.expert_id,
                            area_id=innovation_areas[area_name]
                        )
                        db.add(expert_area)
    
    # Commit all changes
    db.commit()
    print("Data import completed successfully")

if __name__ == "__main__":
    # Create database tables
    from createDB import engine
    Base.metadata.create_all(bind=engine)
    
    # File path
    csv_path = "START Hack 25_Canton of St.Gallen_dataset innovation ecosystem_enriched_new.csv"
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Import data
        import_innovation_data(db, csv_path)
    finally:
        db.close()