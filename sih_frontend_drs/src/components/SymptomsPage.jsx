import React, { useState } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import SymptomsSearch from "./SymptomSearch";



function SymptomsPage(props){

    const [isLoad, setIsLoad] = useState(false)
    const [similarArray , setSimilarArray] = useState(["fever",'dihri','cough','head che','summaa'])
    const [postSimilar,setPostSimilar] = useState([])
    const [itemClick,setItemClick]=useState(false)
    const [diseaseDetail,setDiseaseDetail] = useState({})
    const [isDataLoad,SetDataLoad] = useState(false)
    // const []

  

    async function getName(input){
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const GetDisease="https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/getDetails/"+input
        console.log(GetDisease)
        try{
            const Disresponse = await axios.get(
                proxyurl + GetDisease
              );
              setDiseaseDetail(Disresponse.data);
              SetDataLoad(true)
              console.log("👉 Returned data:", Disresponse.data);

        }catch (e) {
            // props.getStatus("error", "Outrage Added");
            console.log(`😱 Axios request failed: ${e}`);
          }
        // setIsLoad(true)

    }

    function CheckArray(item){
        var count=postSimilar.length;
        for(var i=0;i<count;i++)
        {
            if(postSimilar[i]===item){return true;}
        }
        return false;
    }
    


    function displayItem(item,index){
        return(
            <div className={("symptoms-item"+ (itemClick && (postSimilar.find(element => element === item)) ? " clicked": "" )  )} key={index} onClick={
                ()=>{
                    setItemClick(true)
                    SymptomsClick(item,index)
                }
            }>
                {item}
            </div>
        )
    }

    function SymptomsClick(item,index){
        if(CheckArray(item)){
            setPostSimilar(postSimilar.filter((e)=>(e !== item)))
        }else{
            setPostSimilar((prevData)=>{
                return[
                    ...prevData,
                    item
            ]
            })
        }
    }

    async function PostSimilarArray(){

        const proxyurl = "https://cors-anywhere.herokuapp.com/";        
        const PSymptoms="https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/getDetails/symptoms/findPossibleDisease"
        console.log(postSimilar);
        try {
            const response = await axios.post(
              proxyurl + PSymptoms,
              {symptoms:postSimilar}
            );
            console.log("👉 Returned data:", response.data[0][1]);

            if(response.data[0][1]!==undefined){
                const GetDisease="https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/getDetails/"+response.data[0][1]
                console.log(GetDisease)
                try{
                    const Disresponse = await axios.get(
                        proxyurl + GetDisease
                      );
                      setDiseaseDetail(Disresponse.data);
                      SetDataLoad(true)
                      console.log("👉 Returned data:", Disresponse.data);

                }catch (e) {
                    // props.getStatus("error", "Outrage Added");
                    console.log(`😱 Axios request failed: ${e}`);
                  }
            }
          
          } catch (e) {
            // props.getStatus("error", "Outrage Added");
            console.log(`😱 Axios request failed: ${e}`);
          }
        // try {
        //     axios.get(proxyurl + PSymptoms).then(res => {
        //       console.log(res.data);
        //     //   setSymptomsArray(res.data);
             
        //     });
        //   } catch (e) {
        //     console.log(e);
        //   }
         
    }

    return(
        <div>
        <NavBar />
        <SymptomsSearch getName={getName} setSimilarArray={setSimilarArray}/>
       
        {/* {isLoad && (
            <div>
            <h1 className="text-center">Click Similar Symptoms</h1>
            <div className="my-3 symptoms-result">
             
               {similarArray.map(displayItem)}
            </div>
            <div className="d-flex justify-content-center">
            <button className="btn btn-primary"  onClick={()=>{
                PostSimilarArray()
            }}> Search With Symptoms</button>
            </div>
            </div>
        )} */}

        {isDataLoad&& <div className='row mt-3'>
            <div className="col-md-12">

            <div className="card shadow">
                <div  className='card-Title'> 
                    <h1 className='text-center text-info'>
                    {diseaseDetail.disease}
                    </h1>
                </div>
                <div className='card-body'>

                    <div className='desc'> 
                    <h1 className='disease-Name text-info text-left px-4'>Description <i class="fas fa-pencil-alt text-primary"></i></h1>
                    <h4 className="p-3">
                        {diseaseDetail.description}
                    </h4>
                    </div>
                    <div className='guide'> 
                    <h1 className='disease-Name text-info text-left px-4'>Guidelines <i class="fab fa-glide text-primary"></i></h1>
                    <h4 className="p-3">
                        {diseaseDetail.guidelines}
                    </h4>
                    </div>

                    <div className='container-fluid'>
                    <h1 className='disease-Name text-info text-left px-4'>Symptoms <i class="fas fa-assistive-listening-systems text-primary"></i></h1>
                    <div className='row'>
                  
                        <div className='col-md-6 text-left'>
                        
                        <h2 className='text-info' style={{fontSize:'20px',fontWeight:'500'}}>
                            Human <i class="fas fa-male text-info"></i>
                        </h2>

                        {diseaseDetail.symptoms.humans.map((value,index)=>{
                                return (<div>  <h4 key={index}><i class="fas fa-italic"></i> {value}</h4> </div>)
                        })}

                            
                        </div>
                        <div className='col-md-6 text-left'>
                        
                        <h2 className='text-info' style={{fontSize:'20px',fontWeight:'500'}}>
                            Animal <i class="fas fa-paw text-info"></i>
                        </h2>

                        {diseaseDetail.symptoms.animals.map((value,index)=>{
                            return (<div> <h4  key={index}> <i class="fas fa-italic"></i> {value}</h4> </div>)
                        })}

                            
                        </div>
                       
                    </div>
                    </div>

                    <div className='guide'> 
                    <h1 className='disease-Name text-info text-left px-4'>Treatments</h1>\
                    <div className='row'>
                        <div className='col-md-6 text-left'> 
                        <h2 className='text-info' style={{fontSize:'20px',fontWeight:'500'}}>
                            Human <i class="fas fa-male text-info"></i>
                        </h2>
                        <h4 className="p-3">
                        <i class="fas fa-italic"></i> 
                        {diseaseDetail.treatments.humans}
                        </h4>
                        </div>
                        <div className='col-md-6 text-left'> 
                        <h2 className='text-info' style={{fontSize:'20px',fontWeight:'500'}}>
                            Animal <i class="fas fa-paw text-info"></i>
                        </h2>
                        <h4 className="p-3">
                        <i class="fas fa-italic"></i> 
                        {diseaseDetail.treatments.animals}
                        </h4>
                        </div>
                    </div>
                    
                    </div>

                    

                </div>

            </div>

              

            </div>
        </div>}
        

        </div>
    )
}

export default SymptomsPage;