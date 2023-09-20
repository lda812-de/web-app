const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const handlebars = require('handlebars');
const { MongoClient, ObjectId} = require("mongodb");
const {readFile} = require("fs");

const uri = 'mongodb+srv://sparking:Az123456@dbs.bgpecdq.mongodb.net/test?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();
const hbs = exphbs.create();
app.use(express.urlencoded({ extended: true }));

// Set up Handlebars as the view engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

client.connect()
    .then(async () => {
        app.post("/payment", async (req, res) => {

            let id = req.body?._id;
            if (!id) {
                throw new Error("Chưa truyền id lên");
            }

            try {
                const database = client.db('ATH_UET');
                const RFCollection = database.collection('RFid');

                // Find the RFItem by its _id
                // if (!RFItem) {
                //     throw new Error("Không tìm thấy mục RF với id đã cung cấp");
                // }

                // RFItem.timeCheckout = new Date();
                const updateResult = await RFCollection.updateOne(
                    { _id: new ObjectId(id) }, // Correctly formatted _id
                    { $set: { timeCheckout: new Date() } });
                if (updateResult.modifiedCount === 1) {
                    console.log(`Cập nhật thành công cho RFItem có id ${id}`);
                    res.redirect('/');
                } else {
                    console.error(`Không cập nhật RFItem có id ${id}`);
                }
            } catch (error) {
                console.error('Lỗi:', error);
                // Handle error
            }

        });
        console.log('Connected to MongoDB');
        app.post('/submit', async (req, res) => {
            const formData = req.body;
            console.log('Form Data:', formData);
            formData.timeCheckin = new Date();
            try {
                const database = client.db('ATH_UET');
                const RFCollection = database.collection('RFid');

                // Insert the form data into the 'RFid' collection
                try {
                    const insertResult = await RFCollection.insertOne(formData);
                    res.redirect('/');
                } catch (e) {
                    console.error('Failed to insert form data');
                    res.status(500).send('Failed to insert form data.');
                }



            } catch (error) {
                console.error('Error:', error);
                res.status(500).send('Internal Server Error');
            }
        });

        app.get('/', async (req, res) => {
            const templatePath = path.join(__dirname, 'template.hbs');
            try {
                const database = client.db('ATH_UET');
                const RFCollection = database.collection('RFid');

                // Find parking by ID
                const parkingId = '64b511d8df2296f943328e3d';
                const parking = await database.collection('parking').findOne({ _id: new ObjectId(parkingId)});
                console.log(parking)

                // Find RF records
                const RFs = await RFCollection.find({})
                    .sort({ lastModified: 1 }) // 1 for ascending order, -1 for descending
                    .limit(10)
                    .toArray();

                console.log(RFs)
                // RFs.forEach(rf => {
                //     if (!rf?.timeCheckout):
                //
                // });

                readFile(templatePath, 'utf-8', (err, templateContent) => {
                    if (err) {
                        res.status(500).send('Error loading the template.');
                    } else {
                        const data = {
                            videos: [
                                { id: 1, src: '/public/video1.mp4' },
                                { id: 2, src: '/public/video2.mp4' },
                                { id: 3, src: '/public/video3.mp4' },
                                { id: 4, src: 'https://www.example.com/path-to-your-video.mp4' }
                            ],
                            rfs: RFs,
                            parking: parking // Add parking data to the template data
                        };
                        const template = handlebars.compile(templateContent);
                        const renderedHtml = template(data);

                        res.status(200).send(renderedHtml);
                    }
                });
            } catch (error) {
                console.error('Error:', error);
                res.status(500).send('Internal Server Error');
            }
        });

        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });
