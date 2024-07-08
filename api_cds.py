import cdsapi


#Erstellen des Clients

#Creating the Client

c = cdsapi.Client()

#Beziehen der Daten

#Getting the Data

c.retrieve(
    'cems-glofas-forecast',
    {
        'variable': 'snow_depth_water_equivalent',
        'format': 'grib',
        'year': '2024',
        'month': '07',
        'day': '04',
        'leadtime_hour': '48',
        'hydrological_model': 'lisflood',
        'product_type': 'control_forecast',
        'system_version': 'operational',
    },
    'download.grib')

#Hinzufügen der Daten in eine Variable

#Adding the Data to a Variable

with open('download.grib', 'rb') as f:
    data = f.read()

#Ausgeben der Variable

#Showing the content of the Variable

    print(data)