import React , {useState, useEffect} from "react";
import $ from "jquery";
import { Tabs, Tab, AppBar, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";


//import ReactDOM from "react-dom";


const useStyles = makeStyles({
<<<<<<< HEAD
    root: {
      flexGrow: 1,
      fontSize: "24px"
    }
  });

  
function DiseaseReport(props) {
    const classes = useStyles();
    useEffect(()=>{
      console.log(props.setdiseaseDetail)
    })
    const [value, setValue] = useState(0);
  let diseaseobj = {
    title: "Malaria",
    overview:
      "The severity of malaria varies based on the species of plasmodium.Symptoms are chills, fever and sweating, usually occurring a few weeks after being bitten.",
    precaution:
      "Avoid mosquito bites by using insect repellent, covering your arms and legs, and using a mosquito net. Check whether you need to take malaria prevention tablets – if you do, make sure you take the right antimalarial tablets at the right dose, and finish the course.",
    cause:
      "Malaria is caused by the Plasmodium parasite. The parasite can be spread to humans through the bites of infected mosquitoes. There are many different types of plasmodium parasite, but only 5 types cause malaria in humans."
  };
  $(document).ready(function() {
    $(".nav-link").on("click", function() {
      $(".nav-link").removeClass("active");
      $(".elements").removeClass("show");
      $(this).addClass("active");
      let a = "." + $(this).attr("id");
      $(a).addClass("show");

      // $($(this).attr("id")).addClass("show");
    });
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <div className="card text-center effect8">
      <h1 className="card-title">{props.setDisease}</h1>
    <Paper className={classes.root}>
              <Tabs value={value} onChange={handleChange}   variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example">
                <Tab label="Description" />
                <Tab label="Guideness" />
              </Tabs>
            </Paper>
            {value === 0 && (<div className="elements diseaseCause">
        <div className="card-body">
          <p className="card-text">{props.setdiseaseDetail.description}</p>
        </div>
      </div> )
        }
        {value === 1 && (<div className="elements diseasePrecaution">
        <div className="card-body">
          <p className="card-text">{props.setdiseaseDetail.guidelines}</p>
        </div>
      </div> )
        }

      {/* <div className="card-header">
        <ul className="nav nav-tabs card-header-tabs">
          <li className="nav-item">
            <a className="nav-link active" href="#" id="diseaseTitle">
              Disease
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" id="diseaseCause">
              Cause
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" id="diseasePrecaution">
              Precautions
            </a>
          </li>
        </ul>
      </div> */}


      {/* <div className="elements diseaseTitle show">
        <div className="card-body">
          <h5 className="card-title">{diseaseobj.title}</h5>
          <p className="card-text">{diseaseobj.overview}</p>
        </div>
      </div> */}

      

      {/*  */}
    </div>
  );
=======
  root: {
    flexGrow: 1,
    fontSize: "24px"
  }
});

var listItems1 =" ";
var listItems2=" ";
var listItems3=" ";
var listItems4=" ";
function DiseaseReport(props) {
  const classes = useStyles();
  useEffect(()=>{
    console.log(props.setdiseaseDetail);
    const humanSymptoms =props.setdiseaseDetail.symptoms.humans;
    const animalSymptoms =props.setdiseaseDetail.symptoms.animals;
    const humantreat =props.setdiseaseDetail.treatments.humans;
    const animaltreat =props.setdiseaseDetail.treatments.animals;
    listItems1 = humanSymptoms.map((number)=> <li className="desc1">{number}</li>);
    listItems2 = animalSymptoms.map((number)=> <li className="desc1">{number}</li>);
    listItems3=humantreat.map((number)=> <li className="desc1">{number}</li>);
    listItems4=animaltreat.map((number)=> <li className="desc1">{number}</li>);

    
  })
  const [value, setValue] = useState(0);
let diseaseobj = {
  title: "Malaria",
  overview:
    "The severity of malaria varies based on the species of plasmodium.Symptoms are chills, fever and sweating, usually occurring a few weeks after being bitten.",
  precaution:
    "Avoid mosquito bites by using insect repellent, covering your arms and legs, and using a mosquito net. Check whether you need to take malaria prevention tablets – if you do, make sure you take the right antimalarial tablets at the right dose, and finish the course.",
  cause:
    "Malaria is caused by the Plasmodium parasite. The parasite can be spread to humans through the bites of infected mosquitoes. There are many different types of plasmodium parasite, but only 5 types cause malaria in humans."
};
$(document).ready(function() {
  $(".nav-link").on("click", function() {
    $(".nav-link").removeClass("active");
    $(".elements").removeClass("show");
    $(this).addClass("active");
    let a = "." + $(this).attr("id");
    $(a).addClass("show");
    //var sym= symptoms.humans.split(" ");
    //console.log(sym);

    // $($(this).attr("id")).addClass("show");
  });
});

const handleChange = (event, newValue) => {
  setValue(newValue);
};


return (
  <div className="card text-center effect8">
    <h1 className="card-title">{props.setDisease}</h1>
  <Paper className={classes.root}>
            <Tabs value={value} onChange={handleChange}   variant="scrollable"
        scrollButtons="on"
        indicatorColor="primary"
        textColor="primary"
        aria-label="scrollable force tabs example">
              <Tab  label="Description" />
              <Tab   label="Guidelines" />
              <Tab  label="Symptoms" />
              <Tab  label="Treatment" />
              
            </Tabs>
          </Paper>
          {value === 0 && (<div className="elements diseaseCause">
      <div className="card-body">
        <p className="card-text desc">{props.setdiseaseDetail.description}</p>
      </div>
    </div> )
      }
      {value === 1 && (<div className="elements diseasePrecaution">
      <div className="card-body">
        <p className="card-text desc">{props.setdiseaseDetail.guidelines}</p>
      </div>
    </div> )
      }
         {value === 2 && (<div className="elements diseaseSymptoms">
      <div className="card-body">

        <h3 className="card-text desc1">Humans</h3>
        <ul className="listsym">
        
             {listItems1}


        </ul>
                 
        <h3  className="card-text desc1">Animals</h3>
        <ul className="listsym">
          
                {listItems2}

        </ul>

       </div>
      </div>)}

      {value === 3 && (<div className="elements diseaseTreatments">
      <div className="card-body">
        
      <h3 className="card-text desc1">Humans</h3>
        <ul className="listsym">
        
             {listItems3}


        </ul>
                 
        <h3 className="card-text desc1">Animals</h3>
        <ul className="listsym">
          
                {listItems4}

        </ul>
      </div>
     </div> )
      }

   
 


    



    {/* <div className="card-header">
      <ul className="nav nav-tabs card-header-tabs">
        <li className="nav-item">
          <a className="nav-link active" href="#" id="diseaseTitle">
            Disease
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#" id="diseaseCause">
            Cause
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#" id="diseasePrecaution">
            Precautions
          </a>
        </li>
      </ul>
    </div> */}


    {/* <div className="elements diseaseTitle show">
      <div className="card-body">
        <h5 className="card-title">{diseaseobj.title}</h5>
        <p className="card-text">{diseaseobj.overview}</p>
      </div>
    </div> */}

    

    {/*  */}
  </div>
);
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
}
export default DiseaseReport;
