import cdsapi
import zipfile
import os
import netCDF4
from flask import Flask, jsonify, render_template
import folium
from folium.plugins import HeatMap

app = Flask(__name__)


# Funktion zum Herunterladen und Entpacken der Daten
def download_and_extract_data():
    c = cdsapi.Client()
    c.retrieve(
        'satellite-lake-water-level',
        {
            'variable': 'all',
            'region': [
                'northern_africa', 'northern_asia', 'northern_europe',
                'northern_north_america', 'oceania', 'southeastern_asia',
                'southern_africa', 'southern_america', 'southern_europe',
                'southern_north_america', 'southwestern_asia',
            ],
            'lake': [
                'achit', 'alakol', 'albert', 'amadjuak', 'american_falls', 'aqqikol_hu',
                'argentino', 'athabasca', 'ayakkum', 'aydarkul', 'aylmer', 'azhibeksorkoli',
                'bagre', 'baikal', 'bairab', 'baker', 'balbina', 'balkhash', 'bangweulu',
                'bankim', 'baunt', 'beas', 'beysehir', 'bienville', 'big_trout', 'birch',
                'biylikol', 'bluenose', 'bodensee', 'bogoria', 'bosten', 'bratskoye',
                'bugunskoye', 'cahora_bassa', 'caribou', 'caspian', 'cayuga', 'cedar',
                'cerros_colorados', 'chagbo_co', 'chapala', 'chardarya', 'chatyrkol',
                'chishi', 'chlya', 'chocon', 'chukochye', 'cienagachilloa', 'claire',
                'cochrane', 'corangamite', 'cuodarima', 'dagze_co', 'dalai', 'danau_towuti',
                'danausingkarak', 'dangqiong', 'des_bois', 'dogaicoring_q', 'dorgon',
                'dorsoidong_co', 'dubawnt', 'edouard', 'egridir', 'erie', 'faber', 'fitri',
                'fontana', 'fort_peck', 'garkung', 'george', 'gods', 'grande_trois',
                'greatslave', 'guri', 'gyaring_co', 'gyeze_caka', 'habbaniyah', 'hala',
                'hamrin', 'har', 'hawizeh_marshes', 'heishi_beihu', 'hendrik_verwoerd',
                'hinojo', 'hoh_xil_hu', 'hongze', 'hottah', 'hovsgol', 'hulun', 'huron',
                'hyargas', 'iliamna', 'illmen', 'inarinjarvi', 'issykkul', 'iznik',
                'jayakwadi', 'kabele', 'kabwe', 'kainji', 'kairakum', 'kamilukuak',
                'kamyshlybas', 'kapchagayskoye', 'kara_bogaz_gol', 'karasor', 'kariba',
                'kasba', 'khanka', 'kinkony', 'kisale', 'kivu', 'kokonor', 'kossou',
                'krasnoyarskoye', 'kremenchutska', 'kubenskoye', 'kulundinskoye',
                'kumskoye', 'kuybyshevskoye', 'kyoga', 'ladoga', 'lagdo', 'lagoa_dos_patos',
                'langa_co', 'langano', 'lano', 'leman', 'lixiodain_co', 'lumajangdong_co',
                'luotuo', 'mai_ndombe', 'malawi', 'mangbeto', 'manitoba', 'memar', 'michigan',
                'migriggyangzham', 'mingacevir', 'mono', 'mossoul', 'mullet', 'mweru',
                'naivasha', 'namco', 'namngum', 'nasser', 'nezahualcoyoti', 'ngangze',
                'ngoring_co', 'nicaragua', 'nipissing', 'novosibirskoye', 'nueltin', 'oahe',
                'old_wives', 'onega', 'ontario', 'opinac', 'peipus', 'prespa', 'pukaki',
                'pyaozero', 'ranco', 'roseires', 'rukwa', 'rybinskoye', 'saint_jean',
                'sakakawea', 'saksak', 'san_martin', 'saratovskoye', 'sarykamish', 'sasykkol',
                'saysan', 'segozerskoye', 'serbug', 'sevan', 'shiroro', 'sobradino', 'soungari',
                'srisailam', 'superior', 'swan', 'tana', 'tanganika', 'tangra_yumco', 'tchad',
                'tchany', 'telashi', 'teletskoye', 'telmen', 'tengiz', 'tharthar', 'titicaca',
                'todos_los_santos', 'toktogul', 'tonle_sap', 'tres_marias', 'tsimlyanskoye',
                'tumba', 'turkana', 'ulan_ul', 'ulungur', 'umbozero', 'uvs', 'valencia', 'van',
                'vanajanselka', 'vanerm', 'vattern', 'victoria', 'viedma', 'volta', 'walker',
                'williston', 'winnipeg', 'winnipegosis', 'xiangyang', 'yamzho_yumco',
                'yellowstone', 'zeyskoye', 'zhari_namco', 'zhelin', 'ziling', 'zimbambo',
                'ziway', 'zonag'
            ],
            'version': 'version_4_0',
            'format': 'zip',
        },
        'data/download.zip'
    )

    with zipfile.ZipFile('data/download.zip', 'r') as zip_ref:
        zip_ref.extractall('data')
    print("Daten heruntergeladen und entpackt.")


# Funktion zum Verarbeiten der NetCDF-Dateien
def process_file(filepath):
    data_points = []
    try:
        with netCDF4.Dataset(filepath) as dataset:
            if 'lat' in dataset.variables and 'lon' in dataset.variables:
                lat = dataset.variables['lat'][:]
                lon = dataset.variables['lon'][:]
                water_height = dataset.variables['water_surface_height_above_reference_datum'][:]
                uncertainty = dataset.variables['water_surface_height_uncertainty'][:]

                for i in range(len(lat)):
                    data_points.append((lat[i], lon[i], water_height[i]))
    except Exception as e:
        print(f"Fehler beim Verarbeiten der Datei {filepath}: {e}")
    return data_points


@app.route('/data', methods=['GET'])
def get_data():
    data_directory = 'data'
    results = []
    for filename in os.listdir(data_directory):
        if filename.endswith('.nc'):
            filepath = os.path.join(data_directory, filename)
            results.extend(process_file(filepath))
    return jsonify(results)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/heatmap')
def heatmap():
    data_directory = 'data'
    all_data = []
    for filename in os.listdir(data_directory):
        if filename.endswith('.nc'):
            filepath = os.path.join(data_directory, filename)
            all_data.extend(process_file(filepath))

    # Erstellung der Heatmap
    map_world = folium.Map(location=[0, 0], zoom_start=2)
    heat_data = [[point[0], point[1], point[2]] for point in all_data]
    HeatMap(heat_data).add_to(map_world)

    # Speichern der Karte als HTML-Datei
    map_world.save('templates/heatmap.html')
    return render_template('heatmap.html')


if __name__ == '__main__':
    if not os.path.exists('data'):
        os.makedirs('data')
    download_and_extract_data()
    app.run(debug=True)
