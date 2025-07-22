var express = require("express");
var mysql2 = require("mysql2");
var fileuploader = require("express-fileupload");
var cloudinary = require("cloudinary").v2;
var fs = require("fs");
var nodemailer = require("nodemailer");




var app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyApfn0S6k5gRlpJ1G8RA48QQLX_L2o7jdc");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.use(fileuploader());
app.use(express.urlencoded(true));
app.use(express.json());

app.listen(2006, function () {
    console.log("Server Started at Port no: 2006")
})
app.use(express.static("public"))
let dbConfig = "mysql://avnadmin:AVNS_NVAFLW54Zm_WTqv4xgw@mysql-16e9135b-gulianieknoor-64f5.c.aivencloud.com:21685/project";

let mySqlVen = mysql2.createConnection(dbConfig);
mySqlVen.connect(function (errKuch) {
    if (errKuch == null)
        console.log("AiVen Connected Successfulllyyy!!!!");
    else
        console.log(errKuch.message)
})
app.get("/server-index", function (req, resp) {
    let emailid = req.query.txtEmail;
    let pwd = req.query.txtPwd;
    let utype = req.query.combo;

    console.log(emailid);

    mySqlVen.query("insert into signup2025 values(?,?,?,1,current_date())", [emailid, pwd, utype], function (errKuch) {
        if (errKuch == null) {

            resp.send("Record Saved Successfulllyyy....Badhai");
            sendSignupEmail(emailid,utype);
        }
        else
            resp.send(errKuch.message);
    })
})
function sendSignupEmail(recipientEmail, userType) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
port: 465,
secure: true,

        auth: {
            user: "gulianieknoor@gmail.com",
            pass: "evbqfhwuyzogiznv"
        }
    });
    let mailOptions = {
        from: ' "Team"<gulianieknoor@gmail.com>',
        to: recipientEmail,
        subject: "Welcome user To GameZone",
        html: `<p>CONGRATULATIONS! YOU SUCCESSFULLY SIGNED UP AS A <b>${userType}</b>.</p>  
       <p>We’re glad to have you on board. 🏆</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Signup email sent: " + info.response);
        }
    })

};


app.get("/login-server", function (req, resp) {



    mySqlVen.query("select * from signup2025 where emailid=? and pwd=? ", [req.query.txtEmail, req.query.txtPwd], function (errKuch, allrecords) {


        if (allrecords.length == 0) {
            resp.send("Invalid");
        }
        else if (allrecords[0].status == 1) {
            resp.send(allrecords[0].utype);
        }
        else {
            resp.send(" Blocked");
        }



    })



})
app.use(express.urlencoded(true));
cloudinary.config({
    cloud_name: 'dc7ydnx4c',
    api_key: '955148138655365',
    api_secret: 'j-yOjQxOGkqCCWMRaWTV4fDorLg' // Click 'View API Keys' above to copy your API secret
});
app.post("orgdetails", async function (req, resp) {
    let picurl = "";
    if (req.files != null) {
        let fName = req.files.profilePic.name;
        let fullPath = __dirname + "/public/pics/" + fName;
        req.files.profilePic.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
            picurl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server

            console.log(picurl);
        })
    }

})

app.post("/orgdetails", async function (req, resp) {
    let picurl = "";
    if (req.files != null) {
        let fName = req.files.profilePic.name;
        let fullPath = __dirname + "/public/pics/" + fName;
        req.files.profilePic.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
            picurl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server

            console.log(picurl);

        });
    }

    else
        picurl = "nopic.jpg";
    let emailid = req.body.txtEmail;
    let orgname = req.body.txtOrg;
    let regnumber = req.body.regNo;
    let address = req.body.add;
    let city = req.body.cty;
    let sports = req.body.Dis;
    let website = req.body.web;
    let insta = req.body.inst;
    let head = req.body.orghead;
    let contact = req.body.cno;
    let otherinfo = req.body.Oinfo;

    mySqlVen.query("insert into organizers values (?,?,?,?,?,?,?,?,?,?,?,?)", [emailid, orgname, regnumber, address, city, sports, website, insta, head, contact, picurl, otherinfo], function (errKuch) {
        if (errKuch == null)
            resp.send("Record Saved Successfulllyyy....Badhai");
        else
            resp.send(errKuch)
    })
})
app.post("/update-user", async function (req, resp) {
    let picurl = "";
    if (req.files != null) //user wants to Update Profile Pic
    {
        let fName = req.files.profilePic.name;
        let fullPath = __dirname + "/public/pics/" + fName;
        req.files.profilePic.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
            picurl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server

            console.log(picurl);
        });
    }
    else
        picurl = req.body.hdn;

    let emailid = req.body.txtEmail;
    let orgname = req.body.txtOrg;
    let regnumber = req.body.regNo;
    let address = req.body.add;
    let city = req.body.cty;
    let sports = req.body.Dis;
    let website = req.body.web;
    let insta = req.body.inst;
    let head = req.body.orghead;
    let contact = req.body.cno;
    let otherinfo = req.body.Oinfo;



    mySqlVen.query("update organizers  set orgname=?,regnumber=?,address=?,city=?,sports=?,website=?,insta=?,head=?,contact=?,picurl=?,otherinfo=?  where emailid=?", [orgname, regnumber, address, city, sports, website, insta, head, contact, picurl, otherinfo, emailid], function (errKuch, result) {
        if (errKuch == null) {
            if (result.affectedRows == 1)
                resp.send("Record Saved Successfulllyyy....Badhai");
            else
                resp.send("Inavlid email Id");
        }
        else
            resp.send(errKuch.message)
    })

})
app.get("/get-one", function (req, resp) {
    mySqlVen.query("select * from organizers where emailid=?", [req.query.Email], function (err, allRecords) {
        if (allRecords.length == 0)
            resp.send("No Record Found");
        else
            resp.json(allRecords);

    })
})
app.get("/tournament-server", function (req, resp) {
    let emailid = req.query.emailid;
    let eventname = req.query.eventname;
    let doe = req.query.doe;
    let toe = req.query.toe;
    let address = req.query.address;
    let city = req.query.city;
    let sports = req.query.sports;
    let minage = req.query.minage;
    let maxage = req.query.maxage;
    let lastdate = req.query.lastdate;
    let fee = req.query.fee;
    let prize = req.query.prize;
    let contact = req.query.contact;


    mySqlVen.query("insert into tournaments values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [null, emailid, eventname, doe, toe, address, city, sports, minage, maxage, lastdate, fee, prize, contact], function (errKuch) {
        if (errKuch == null)
            resp.send("Record Saved Successfulllyyy....Badhai");
        else
            resp.send(errKuch.message);
    })
})
app.get("/do-fetch-all-users", function (req, resp) {
    let emailid = req.query.InputEmail1;
    console.log(emailid);
    mySqlVen.query("select * from tournaments  where emailid=?", [emailid], function (err, allRecords) {
        console.log(err);
        resp.send(allRecords);
    })
})

app.get("/delete-one", function (req, resp) {
    console.log(req.query)
    let emailid = req.query.emailid1;
    console.log(emailid);

    mySqlVen.query("delete from tournaments where rid=?", [emailid], function (errKuch, result) {
        if (errKuch == null) {
            if (result.affectedRows == 1)
                resp.send(emailid + " Deleted Successfulllyyyy...");
            else
                resp.send("Invalid Email id");
        }
        else
            resp.send(errKuch);

    })
})

app.post("/playerdetails", async function (req, resp) {
    try {
        let picurl = "nopic.jpg";
        let picurl1 = "nopic.jpg";
        let jsonData = {}; // Initialize empty object

        // Upload profilePic and get jsonData
        if (req.files && req.files.profilePic) {
            let fName = req.files.profilePic.name;
            let fullPath = __dirname + "/public/pics/" + fName;
            await req.files.profilePic.mv(fullPath);
            let picUrlResult = await cloudinary.uploader.upload(fullPath);
            picurl = picUrlResult.url;

            // Analyze image to get name, dob, gender
            jsonData = await RajeshBansalKaChirag(picurl);
            console.log("ProfilePic uploaded:", picurl);
        }

        // Upload profilePic1
        if (req.files && req.files.profilePic1) {
            let fName1 = req.files.profilePic1.name;
            let fullPath1 = __dirname + "/public/pics/" + fName1;
            await req.files.profilePic1.mv(fullPath1);
            let picUrlResult1 = await cloudinary.uploader.upload(fullPath1);
            picurl1 = picUrlResult1.url;
            console.log("ProfilePic1 uploaded:", picurl1);
        }

        // Extract form data
        let emailid = req.body.txtEmail4;
        let address = req.body.add;
        let contact = req.body.con;
        let game = req.body.gup;
        let otherinfo = req.body.oinfo;

        // Debug info
        console.log("jsonData:", jsonData);
        // Convert dob to YYYY-MM-DD format if it exists
        // let formattedDob = null;
        // if (jsonData.dob) {
        //     let parts = jsonData.dob.split('/');
        //     if (parts.length === 3) {
        //         // Assume input is in DD/MM/YYYY format
        //         formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
        //     }
        // }


        // Insert into MySQL (includes name!)
        mySqlVen.query(
            "INSERT INTO players VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            [
                null, // ID (auto-increment)
                emailid,
                picurl,
                picurl1,
                jsonData.name || null,   // ✅ Added name
                jsonData.dob || null,
                jsonData.gender || null,
                address,
                contact,
                game,
                otherinfo,
            ],
            function (errKuch, allRecords) {
                if (errKuch == null) {
                    resp.send("Sent Successfully");
                } else {
                    console.error("DB Error:", errKuch);
                    resp.send(errKuch.message);
                }
            }
        );
    } catch (err) {
        console.error("Server Error:", err);
        resp.status(500).send("Server Error: " + err.message);
    }
});







app.get("/get-data", function (req, resp) {
    mySqlVen.query("select * from players where emailid=?", [req.query.email], function (err, allRecords) {
        if (allRecords.length == 0)
            resp.send("No Record Found");
        else
            resp.json(allRecords);

    })
})
app.get("/do-fetch-all-signup", function (req, resp) {
    // let emailid=req.query.InputEmail1;
    //console.log(emailid);
    mySqlVen.query("select * from signup2025 ", function (err, allRecords) {
        console.log(err);
        resp.send(allRecords);
    })
})
app.get("/doBlock", function (req, resp) {
    let userMail = req.query.emailid1;
    //col name Same as  table col name
    mySqlVen.query("update signup2025 set status=0 where emailid=?", [userMail], function (err, result) {
        if (err == null) {
            if (result.affectedRows == 1)
                resp.send("Status block Successfulllyyyy");
            else
                resp.send("Inavlid User Id");
        }
        else
            resp.send(err.message);
    })
})

app.get("/Resume", function (req, resp) {
    let userMail = req.query.emailid1;
    //col name Same as  table col name
    mySqlVen.query("update signup2025 set status=1 where emailid=?", [userMail], function (err, result) {
        if (err == null) {
            if (result.affectedRows == 1)
                resp.send("Status Resume Successfulllyyyy");
            else
                resp.send("Inavlid User Id");
        }
        else
            resp.send(err.message);
    })
})
/////////////////////////////////////////////////////////////////
async function RajeshBansalKaChirag(imgurl) {
    const myprompt = "Read the text on picture and tell all the information in adhaar card and give output STRICTLY in JSON format {adhaar_number:'', name:'', gender:'', dob: ''}. Dont give output as string."
    const imageResp = await fetch(imgurl)
        .then((response) => response.arrayBuffer());

    const result = await model.generateContent([
        {
            inlineData: {
                data: Buffer.from(imageResp).toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        myprompt,
    ]);
    console.log(result.response.text())

    const cleaned = result.response.text().replace(/```json|```/g, '').trim();
    const jsonData = JSON.parse(cleaned);
    console.log(jsonData);

    return jsonData

}
app.get("/do-fetch-all", function (req, resp) {
    let emailid = req.query.InputEmail1;
    console.log(emailid);
    mySqlVen.query("select * from tournaments  where emailid=?", [emailid], function (err, allRecords) {
        console.log(err);
        resp.send(allRecords);
    })
})
app.get("/do-fetch-tournament", function (req, resp) {
    city = req.query.cityKuch;
    sport = req.query.sportKuch;
    age = req.query.ageKuch;


    mySqlVen.query("select * from tournaments where city=? and sports=? ", [city, sport], function (err, allRecords) {
        if (err == null)
            console.log(err);
        resp.send(allRecords);
    })
})
app.get("/do-fetch-organisation", function (req, resp) {
    //let emailid=req.query.inputEmail;
    //console.log(emailid);
    mySqlVen.query("select * from organizers ", function (err, allRecords) {
        console.log(err);
        resp.send(allRecords);
    })
})
app.get("/delete-organisation", function (req, resp) {
    console.log(req.query)
    let emailid = req.query.inputEmail;
    console.log(emailid);

    mySqlVen.query("delete from organizers where emailid=?", [emailid], function (errKuch, result) {
        if (errKuch == null) {
            if (result.affectedRows == 1)
                resp.send(emailid + " Deleted Successfulllyyyy...");
            else
                resp.send("Invalid Email id");
        }
        else
            resp.send(errKuch);

    })
})
app.get("/do-fetch-all-player", function (req, resp) {
    let emailid = req.query.inputEmail;
    console.log(emailid);
    mySqlVen.query("select * from players ", function (err, allRecords) {
        console.log(err);
        resp.send(allRecords);
    })
})
app.get("/do-fetch-update", function (req, resp) {
    let emailid = req.query.emailid;
    let oldpassword = req.query.pwdkuch;
    let newpassword = req.query.newpwd
    console.log(emailid);
    console.log(oldpassword);
    console.log(newpassword);

    mySqlVen.query("update signup2025  set pwd=?  where emailid=? and pwd=?", [newpassword, emailid, oldpassword], function (errKuch, result) {
        if (errKuch == null) {
            if (result.affectedRows == 1)
                resp.send("Record update Successfullly");
            else
                resp.send("Inavlid email Id");
        }
        else
            resp.send(errKuch.message)
    })
})
app.get("/do-fetch-event", function (req, resp) {
    let city = req.query.cityKuch;
    let sport = req.query.sportKuch;
    let age = req.query.ageKuch;
    conn.query("select * from tournaments where city=? and sports=? and minage<=?", [city, sport, age], function (err, allRecords) {
        resp.send(allRecords);
    })

})


app.get("/do-fetch-all-cities", function (req, resp) {
    mySqlVen.query("select distinct city from tournaments", function (err, allRecords) {
        resp.send(allRecords);
    })
})

app.get("/do-fetch-all-sport", function (req, resp) {
    mySqlVen.query("select distinct sports from tournaments", function (err, allRecords) {
        resp.send(allRecords);
    })
})
app.get("/do-fetch-all-Age", function (req, resp) {
    mySqlVen.query("select distinct minage from tournaments", function (err, allRecords) {
        resp.send(allRecords);
    })
})