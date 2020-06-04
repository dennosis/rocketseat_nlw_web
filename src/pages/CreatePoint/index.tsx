import React,{useEffect, useState, ChangeEvent} from 'react';
import './styles.css';
import logo from "../../assets/logo.svg"
import { Link }  from 'react-router-dom'
import {FiArrowLeft} from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import {LeafletMouseEvent} from  'leaflet'
import axios from 'axios'
import api from '../../services/api'

interface Item {
    id:number,
    title:string,
    image_url:string
}
interface IBGEUfResponse {
    sigla:string
}
interface IBGECityResponse {
    nome:string
}

const CreatePoint = ()=> {
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([])
    const [citys, setCitys] = useState<string[]>([])

    const [initialPosition, setInitialPosition] = useState<[number,number]>([0,0])

    const [slectedUf, setSlectedUf] = useState<string>('0')
    const [slectedCity, setSlectedCity] = useState<string>('0')
    const [slectedPosition, setSlectedPosition] = useState<[number,number]>([0,0])

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(position=>{
            const {latitude, longitude} = position.coords
            setInitialPosition([latitude, longitude])
        })
    },[])

    useEffect(()=>{
        api.get('items').then(res=>{
            setItems(res.data)
        })
    },[])
    useEffect(()=>{
        axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res=>{
            const ufInitials = res.data.map(uf=>uf.sigla)
            setUfs(ufInitials)
        })
    },[])

    useEffect(()=>{
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${slectedUf}/municipios`).then(res=>{
            const cityNames = res.data.map(city=>city.nome)
            setCitys(cityNames)
        })
    },[slectedUf])


    function handleSeletUf(event:ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;
        setSlectedUf(uf)
    }
    function handleSeletCity(event:ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;
        setSlectedCity(city)
    }


    function handleMapClick(event:LeafletMouseEvent){
            const position = event.latlng
            setSlectedPosition([
                position.lat,
                position.lng
            ])
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt=""/>
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para Home
                </Link>
            </header>
            <form action="">

                <h1>Cadastro do ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            name="name" 
                            type="text"
                            id="name"
                        />
                    </div>
                    
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                name="email" 
                                type="text"
                                id="email"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whasapp">Whasapp</label>
                            <input 
                                name="whasapp" 
                                type="text"
                                id="whasapp"
                            />
                        </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Enderço</h2>
                        <span>Selecione o endereço do mapa</span>
                    </legend>
                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer 
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[slectedPosition[0], slectedPosition[1]]}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </Map>

                    <div className="field">
                        <label htmlFor="uf">Estado Uf</label>
                        <select 
                            value={slectedUf}
                            onChange={handleSeletUf}
                            name="uf" 
                            id="uf"
                        >
                            <option value="0">Selecione uma Estado</option>
                            {   
                                ufs.map(uf=><option value={uf}>{uf}</option>)    
                            }
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="city">Cidade</label>
                        <select 
                            value={slectedCity}
                            onChange={handleSeletCity}
                            name="city" 
                            id="city"
                        >
                            <option value="0">Selecione uma cidade</option>
                            {   
                                citys.map(city=><option value={city}>{city}</option>)    
                            }
                        </select>
                    </div>
                </fieldset>
            
                <fieldset>
                    <legend>
                        <h2>Items de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                        
                    </legend>

                    <ul className="items-grid">
                        {
                            items.map(item=>{
                                return(
                                    <li key={item.id}>
                                        <img src={item.image_url} alt={item.title}/>
                                        <span>{item.title}</span>
                                    </li>
                                )
                            })
                        }
         
                    </ul>
                </fieldset>
            
                <button type="submit"> cadastrar</button>
            </form>

        </div>
    );
}

export default CreatePoint;