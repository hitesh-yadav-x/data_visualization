const get_json_data = async (filename) => {
    try {
        const response = await d3.json(filename);
        return response;
    }
    catch (error) {
        console.log(error);
        throw Error(`Failed to get data from file ${filename}`)
    }
}

const get_csv_data = async (filename) => {
    try {
        const response = await d3.csv(filename);
        return response;
    }
    catch (error) {
        console.log(error);
        throw Error(`Failed to get data from file ${filename}`)
    }
}