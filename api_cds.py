import cdsapi
import zipfile
import os
import netCDF4 as nc

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
            'achit', 'alakol', 'albert',
            'amadjuak', 'american_falls', 'aqqikol_hu',
            'argentino', 'athabasca', 'ayakkum',
            'aydarkul', 'aylmer', 'azhibeksorkoli',
            'bagre', 'baikal', 'bairab',
            'baker', 'balbina', 'balkhash',
            'bangweulu', 'bankim', 'baunt',
            'beas', 'beysehir', 'bienville',
            'big_trout', 'birch', 'biylikol',
            'bluenose', 'bodensee', 'bogoria',
            'bosten', 'bratskoye', 'bugunskoye',
            'cahora_bassa', 'caribou', 'caspian',
            'cayuga', 'cedar', 'cerros_colorados',
            'chagbo_co', 'chapala', 'chardarya',
            'chatyrkol', 'chishi', 'chlya',
            'chocon', 'chukochye', 'cienagachilloa',
            'claire', 'cochrane', 'corangamite',
            'cuodarima', 'dagze_co', 'dalai',
            'danau_towuti', 'danausingkarak', 'dangqiong',
            'des_bois', 'dogaicoring_q', 'dorgon',
            'dorsoidong_co', 'dubawnt', 'edouard',
            'egridir', 'erie', 'faber',
            'fitri', 'fontana', 'fort_peck',
            'garkung', 'george', 'gods',
            'grande_trois', 'greatslave', 'guri',
            'gyaring_co', 'gyeze_caka', 'habbaniyah',
            'hala', 'hamrin', 'har',
            'hawizeh_marshes', 'heishi_beihu', 'hendrik_verwoerd',
            'hinojo', 'hoh_xil_hu', 'hongze',
            'hottah', 'hovsgol', 'hulun',
            'huron', 'hyargas', 'iliamna',
            'illmen', 'inarinjarvi', 'issykkul',
            'iznik', 'jayakwadi', 'kabele',
            'kabwe', 'kainji', 'kairakum',
            'kamilukuak', 'kamyshlybas', 'kapchagayskoye',
            'kara_bogaz_gol', 'karasor', 'kariba',
            'kasba', 'khanka', 'kinkony',
            'kisale', 'kivu', 'kokonor',
            'kossou', 'krasnoyarskoye', 'kremenchutska',
            'kubenskoye', 'kulundinskoye', 'kumskoye',
            'kuybyshevskoye', 'kyoga', 'ladoga',
            'lagdo', 'lagoa_dos_patos', 'langa_co',
            'langano', 'lano', 'leman',
            'lixiodain_co', 'lumajangdong_co', 'luotuo',
            'mai_ndombe', 'malawi', 'mangbeto',
            'manitoba', 'memar', 'michigan',
            'migriggyangzham', 'mingacevir', 'mono',
            'mossoul', 'mullet', 'mweru',
            'naivasha', 'namco', 'namngum',
            'nasser', 'nezahualcoyoti', 'ngangze',
            'ngoring_co', 'nicaragua', 'nipissing',
            'novosibirskoye', 'nueltin', 'oahe',
            'old_wives', 'onega', 'ontario',
            'opinac', 'peipus', 'prespa',
            'pukaki', 'pyaozero', 'ranco',
            'roseires', 'rukwa', 'rybinskoye',
            'saint_jean', 'sakakawea', 'saksak',
            'san_martin', 'saratovskoye', 'sarykamish',
            'sasykkol', 'saysan', 'segozerskoye',
            'serbug', 'sevan', 'shiroro',
            'sobradino', 'soungari', 'srisailam',
            'superior', 'swan', 'tana',
            'tanganika', 'tangra_yumco', 'tchad',
            'tchany', 'telashi', 'teletskoye',
            'telmen', 'tengiz', 'tharthar',
            'titicaca', 'todos_los_santos', 'toktogul',
            'tonle_sap', 'tres_marias', 'tsimlyanskoye',
            'tumba', 'turkana', 'ulan_ul',
            'ulungur', 'umbozero', 'uvs',
            'valencia', 'van', 'vanajanselka',
            'vanerm', 'vattern', 'victoria',
            'viedma', 'volta', 'walker',
            'williston', 'winnipeg', 'winnipegosis',
            'xiangyang', 'yamzho_yumco', 'yellowstone',
            'zeyskoye', 'zhari_namco', 'zhelin',
            'ziling', 'zimbambo', 'ziway',
            'zonag',
        ],
        'version': 'version_4_0',
        'format': 'zip',
    },
    'download.zip')

#Unzip the Data

with zipfile.ZipFile('download.zip', 'r') as zip_ref:
    zip_ref.extractall('lake_data')

data_list = []

for nc_file in os.listdir('lake_data'):
    if nc_file.endswith('.nc'):
        with nc.Dataset(os.path.join('lake_data', nc_file)) as ds:
            print(f"Verfügbare Variablen in {nc_file}: {list(ds.variables.keys())}")
            # Extract the correct variable (water_surface_height_above_reference_datum)
            try:
                water_level = ds['water_surface_height_above_reference_datum'][:]
                data_list.append(water_level)
            except KeyError:
                print(f"Variable 'water_surface_height_above_reference_datum' nicht in {nc_file} gefunden.")

# Output the list
print(data_list)