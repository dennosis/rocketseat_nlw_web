import React,{useEffect, useState, ChangeEvent, FormEvent} from 'react';
import './styles.css';
import logo from "../../assets/logo.svg"
import { Link, useHistory }  from 'react-router-dom'
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

    const [formData, setFormData] = useState({
        name:'',
        email:'',
        whatsapp:''
    });

    const [selectedUf, setSelectedUf] = useState<string>('0')
    const [selectedCity, setselectedCity] = useState<string>('0')
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0])

    const history = useHistory()

    useEffect(()=>{
        
        setInitialPosition([-29.7704546,-51.1442605])
        /*
        navigator.geolocation.getCurrentPosition(position=>{
            const {latitude, longitude} = position.coords
            setInitialPosition([latitude, longitude])
        })
        */
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
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(res=>{
            const cityNames = res.data.map(city=>city.nome)
            setCitys(cityNames)
        })
    },[selectedUf])


    function handleSeletUf(event:ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;
        setSelectedUf(uf)
    }
    function handleSeletCity(event:ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;
        setselectedCity(city)
    }
    function handleMapClick(event:LeafletMouseEvent){
            const position = event.latlng
            setSelectedPosition([
                position.lat,
                position.lng
            ])
    }
    function handleInputChange(event:ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target
        setFormData({
            ...formData,
            [name]:value
        })
    }
    function handleSeletItem(id:number){
        const alreadeySelected = selectedItems.findIndex(item=>item===id)
        if(alreadeySelected >= 0){
            const filteredItems = selectedItems.filter(item=>item!== id)
            setSelectedItems(filteredItems)
        }else{
            setSelectedItems([...selectedItems, id])
        }
    }

    async function handleSubmit(event:FormEvent){
        event.preventDefault()
        const {name, email, whatsapp} = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems
        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        }
        await api.post('points', data).then(()=>{
            alert('Ponto de coleta cadastrado')
            history.push('/')
        }).catch(()=>{
            alert('Erro ao cadastrar ponto de coleta')
        })


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
            <form action="" onSubmit={handleSubmit}>

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
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                name="email" 
                                type="text"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whasapp">Whasapp</label>
                            <input 
                                name="whatsapp" 
                                type="text"
                                id="whatsapp"
                                onChange={handleInputChange}
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
                        <Marker position={selectedPosition}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </Map>

                    <div className="field">
                        <label htmlFor="uf">Estado Uf</label>
                        <select 
                            value={selectedUf}
                            onChange={handleSeletUf}
                            name="uf" 
                            id="uf"
                        >
                            <option value="0">Selecione uma Estado</option>
                            {   
                                ufs.map((uf,index)=><option key={index} value={uf}>{uf}</option>)    
                            }
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="city">Cidade</label>
                        <select 
                            value={selectedCity}
                            onChange={handleSeletCity}
                            name="city" 
                            id="city"
                        >
                            <option value="0">Selecione uma cidade</option>
                            {   
                                citys.map((city, index)=><option key={index} value={city}>{city}</option>)    
                            }
                        </select>
                    </div>
                </fieldset>
            
                <fieldset>
                    <legend>
                        <h2>Itens para coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                        
                    </legend>

                    <ul className="items-grid">

                        {
                            items.map((item, index)=>{
                                return(
                                    <li 
                                        key={index} 
                                        onClick={()=>handleSeletItem(item.id)}
                                        className={selectedItems.includes(item.id)?'selected':""}
                                    >
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