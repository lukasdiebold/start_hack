class Event:
    def __init__(self, name, start_date, end_date, start_time, end_time, desc):
        self.name = name
        self.start_date = start_date
        self.end_date = end_date
        self.start_time = start_time
        self.end_time = end_time
        self.desc = desc
        self.tasks = []

        self.organising_team = OrganisingTeam()
        self.skill_manager = SkillManager()
        self.task_manager = TaskManager()

    def create_skill(self, name):
        self.skill_manager.add_skill(name)

    def get_skills(self):
        return self.skill_manager.get_skills()
    
    def delete_skill(self, id):
        self.skill_manager.remove_skill(id)
    
    def add_organiser(self):
        id = self.organising_team.add_organiser()
        return id
    
    def remove_organiser(self, id):
        self.organising_team.remove_organiser(id)

    def add_name_with_id(self, name, id):
        self.organising_team.add_name_with_id(name, id)

    def mod_desc_with_id(self, id, type, desc):
        self.organising_team.mod_desc_with_id(id, type, desc)

    def remove_desc_with_id(self, id, type):
        self.organising_team.remove_desc_with_id(id, type)

    def add_skill_with_id(self, id, skill):
        self.organising_team.organisers[id].skills.append(skill)


class OrganisingTeam:
    def __init__(self):
        self.organisers = []
        self.counter = 0

    def add_organiser(self):
        self.organisers.append(Organiser(self.counter), self)
        self.counter += 1
        return self.counter-1

    def remove_organiser(self, id):
        self.organisers = [organiser for organiser in self.organisers if organiser.id != id]

    def add_name_with_id(self, name, id):
        self.organisers[id].name = name

    def set_desc_with_id(self, id, type, desc):
        self.organisers[id].desc[type] = desc

    def remove_desc_with_id(self, id, type):
        self.organisers[id].desc.pop(type)

    def add_skill_with_id(self, id, skill):
        self.organisers[id].add_skill(skill)


class Organiser:
    def __init__(self, id, handler):
        self.id = id
        self.handler = handler
        self.name = None
        self.desc = None  # of form { type: "...", desc: "..." }
        self.skills = []

    def remove(self):
        self.handler.remove_organiser(self.id)

    def get_desc(self):
        return self.desc
    
    def set_desc(self, type, desc):
        self.desc[type] = desc

    def remove_desc(self, type):
        self.desc.pop(type)

    def add_skill(self, skill):
        self.skills.append(skill)
    
    def has_skill(self, skill):
        return skill in self.skills
    
class SkillManager:
    def __init__(self):
        self.skills = []
        self.counter = 0

    def add_skill(self, name):
        self.skills.append(Skill(name, self.counter), self)
        self.counter += 1

    def remove_skill(self, id):
        self.skills = [skill for skill in self.skills if skill.id != id]

    def get_skills(self):
        return self.skills

class Skill:
    def __init__(self, name, id, handler):
        self.name = name
        self.id = id
        self.handler = handler

    def remove(self):
        self.handler.remove_skill(self.id)

class SkillSet:
    def __init__(self):
        self.skills = []
        self.amount = 0

    def add_skill(self, skill):
        self.skills.append(skill)

    def remove_skill(self, skill):
        self.skills.remove(skill)
    
    def get_skills(self):
        return self.skills
    
    def get_amount(self):
        return self.amount
    
    def set_amount(self, amount):
        self.amount = amount

class TaskManager:
    def __init__(self):
        self.tasks = []
        self.counter = 0

    def add_task(self, name, desc, skill_set):
        self.tasks.append(Task(self.counter), self)
        self.counter += 1

    def add_name_with_id(self, id, name):
        self.tasks[id].name = name

    def add_desc_with_id(self, id, desc):
        self.tasks[id].desc = desc

    def add_skill_set_with_id(self, id, skill_set):
        self.tasks[id].skill_set = skill_set

class Task:
    def __init__(self, id):
        self.id = id
        self.name = None
        self.desc = None
        self.skill_set = []  # [ [SkillSet, Amount], ... ]


class Schedule:
    def __init__(self, id):
        self.id = id
        self.events = []



# [Orgas] [Events]
# Orgas : name, [Skills]
# Events : name, [relative startime min, relative endtime min] {capabilities: [skills], quantity: amount }

# Result
# 