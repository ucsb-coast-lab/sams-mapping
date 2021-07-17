import sys

def main():
    if(len(sys.argv) != 2):
        print("Pass in one geojson file in the command line")
    
    with open("../" + sys.argv[1]) as f:  #Add the file that needs to be reformated
        formattedFile = "../formatted_" + sys.argv[1]
        with open(formattedFile, "w") as f1:
            for line in f:
                newLine = line[0:line.find("[34")] + "[34."
                restOfLine = line[line.find("[34") + 3: None]
                newLine += restOfLine[0:restOfLine.find(", -119")] + ", -119."
                restOfLine = restOfLine[restOfLine.find(", -119") + 6: None]
                while len(restOfLine) > 0:
                    if restOfLine.find("[34") == -1:
                        newLine += restOfLine
                        restOfLine = ""
                    else:
                        newLine += restOfLine[0:restOfLine.find("[34")] + "[34."
                        restOfLine = restOfLine[restOfLine.find("[34") + 3: len(line)]
                        newLine += restOfLine[0:restOfLine.find(", -119")] + ", -119."
                        restOfLine = restOfLine[restOfLine.find(", -119") + 6: None]
                f1.write(newLine)

if __name__ == "__main__":
    main()
