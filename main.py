from tkinter import *
from skaiciuokle import *

data = [
    {"Category": "Task", "Minimum": 45, "Įkainis": 3.5, "Faktas": None},
    {"Category": "Task", "Minimum": 60, "Įkainis": 5.50, "Faktas": None},
    {"Category": "Task", "Minimum": 90, "Įkainis": 8.50, "Faktas": None},
    {"Category": "Time duration, h", "Minimum": 55, "Įkainis": 0.50, "Faktas": None},
    {"Category": "Time duration, h", "Minimum": 70, "Įkainis": 0.80, "Faktas": None},
    {"Category": "Time duration, h", "Minimum": 110, "Įkainis": 1, "Faktas": None},
    {"Category": "Distance, km", "Minimum": 2000, "Įkainis": 45, "Faktas": None},
    {"Category": "Distance, km", "Minimum": 3000, "Įkainis": 90, "Faktas": None},
    {"Category": "Distance, km", "Minimum": 4000, "Įkainis": 134, "Faktas": None}
]


def faktiniai_duomenys():
    try:
        actual_task = float(entry_task.get())
        actual_time = float(entry_time.get())
        actual_distance = float(entry_distance.get())
    except ValueError:
        result_label.config(text="Įveskite skaičius")
        return

    result_lines = []
    for item in data:
        if item["Category"] == "Task":
            item["Faktas"] = actual_task
        elif item["Category"] == "Time duration, h":
            item["Faktas"] = actual_time
        elif item["Category"] == "Distance, km":
            item["Faktas"] = actual_distance

        bonusas = skaičiuokle_formule(item, item["Faktas"])
        result_lines.append(f"{item['Category']} (Min: {item['Minimum']}, Price: {item['Įkainis']}): {bonusas}")

    result = "\n".join(result_lines)
    result_label.config(text=result)


root = Tk()
root.geometry("450x250")
root.title("Atlyginimo priedo skaičiuoklė")

Label(root, text="Įveskite duomenis").grid(row=0, column=0, columnspan=4)

Label(root, text="Task:").grid(row=1, column=0, sticky='e')
entry_task = Entry(root)
entry_task.grid(row=1, column=1)

Label(root, text="Time duration, h:").grid(row=1, column=2, sticky='e')
entry_time = Entry(root)
entry_time.grid(row=1, column=3)

Label(root, text="Distance, km:").grid(row=2, column=0, sticky='e')
entry_distance = Entry(root)
entry_distance.grid(row=2, column=1)

calculate_button = Button(root, text="Skaičiuoti", command=faktiniai_duomenys)
calculate_button.grid(row=3, column=0, columnspan=4, pady=10)

result_label = Label(root, text="", anchor="w", justify="left")
result_label.grid(row=4, column=0, columnspan=4, sticky='w')

root.mainloop()
