def skaičiuokle_formule(item, actual):
    if not actual >= item["Minimum"]:
        return 0
    if item["Category"] == "Distance, km":
        if actual >= 4000:
            return 134 if item["Minimum"] == 4000 else 0
        elif actual >= 3000:
            return 90 if item["Minimum"] == 3000 else 0
        elif actual >= 2000:
            return 45 if item["Minimum"] == 2000 else 0
    elif item["Category"] == "Task":
        if actual >= 90:
            return 8.5 * actual
        elif 60 <= actual < 90:
            return 5.5 * actual
        elif 45 <= actual < 60:
            return 3.5 * actual
    elif item["Category"] == "Time duration, h":
        if actual >= 110:
            return 1 * actual
        elif 70 <= actual < 110:
            return round(0.8 * actual, 2)
        elif 55 <= actual < 70:
            return round(0.50 * actual, 2)
