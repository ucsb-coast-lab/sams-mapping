#!/usr/bin/python3

import geojson
from geojson import Feature, Point

def main():
    my_point = Point((34.415868, -119.845317))
    feature = Feature(geometry=my_point, id = 2, properties={"country": "USA", "name": "COAST LAB"})

    print(feature.properties, feature.id)

    dump = geojson.dumps(feature, sort_keys=True)
    print(dump)
    textfile = open("example.geojson", "w")
    a = textfile.write(dump)
    textfile.close()


if __name__ == "__main__":
    main()