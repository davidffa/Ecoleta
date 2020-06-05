import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';

import Dropzone from '../../components/DropZone';

import './styles.css';

import logo from '../../assets/logo.svg';

const cities = ['Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco', 'Coimbra',
                 'Évora', 'Faro', 'Guarda', 'Leiria', 'Lisboa', 'Portalegre', 'Porto',
                 'Santarém', 'Setúbal', 'Viana do Castelo', 'Vila Real', 'Viseu'];

interface Item {
    id: number,
    title: string;
    image_url: string;
}

const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([39.6946876, -8.0134408]);
    const [selectedFile, setSelectedFile] = useState<File>();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    });

    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    
    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(pos => {
            const { latitude, longitude } = pos.coords;

            setInitialPosition([latitude, longitude]);
        })
    }, []);

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        })
    }, []);

    function handleSelectedCity(e: ChangeEvent<HTMLSelectElement>) {
        const city = e.target.value;

        setSelectedCity(city);
    }

    function handleMapClick(e: LeafletMouseEvent) {
        setSelectedPosition([
            e.latlng.lat,
            e.latlng.lng
        ]);
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });
    }

    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems);
        }else {
            setSelectedItems([ ...selectedItems, id ]);
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        
        const { name, email, whatsapp } = formData;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        if (!selectedFile) {
            return alert('Selecione uma imagem');
        }

        if (latitude === 0 && longitude === 0) {
            return alert('Selecione um ponto no mapa');
        }

        if (selectedCity === '0') {
            return alert('Selecione uma cidade');
        }

        if (!items.length) {
            return alert('Selecione alguns items de coleta');
        }

        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));
        data.append('image', selectedFile);

        await api.post('points', data);
        
        const overlay = document.getElementById("overlay") as HTMLElement;
        overlay.style.height = "100%";
        
        setTimeout(() => {
            history.push('/');
        }, 2000);
    }

    return (
        <div id="page-create-point">
            <div id="overlay">
                <FiCheckCircle id="check" />
                <p>Registo concluído!</p>
            </div>
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Registo do <br /> ponto de coleta</h1>

                <Dropzone onFileUpload={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={initialPosition[0] === 39.6946876 && initialPosition[1] === -8.0134408 ? 6 : 13} onClick={handleMapClick}>
                        <TileLayer 
                            attribution='&amp;copy <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectedCity}>
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Items de coleta</h2>
                        <span>Selecione um ou mais items abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li 
                                key={item.id} 
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}
                        
                    </ul>
                </fieldset>

                <button type="submit">
                    Registar ponto de coleta
                </button>
            </form>
        </div>
    );
}

export default CreatePoint;