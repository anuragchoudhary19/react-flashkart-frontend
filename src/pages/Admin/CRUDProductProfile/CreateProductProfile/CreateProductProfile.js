import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { flatten, unflatten } from 'flat';
//component
import Sidebar from '../../../../components/nav/Sidebar/Sidebar';
import ImageUpload from '../../UploadFiles/ImageUpload';
import Input from '../../../../components/Elements/Input/Input';
import Button from '../../../../components/Elements/Button/Button';
//function
import { createProductProfile } from '../../../../axiosFunctions/productProfile';
import { getBrands } from '../../../../axiosFunctions/brand';
//css
import classes from './CreateProductProfile.module.css';
//antd
import { Select, Radio } from 'antd';
const { Option } = Select;

const initialState = {
  brand: '',
  product: '',
  title: '',
  description: '',
  price: '',
  discount: '',
  specification: {
    SIM: '',
    network: '',
    memory: {
      ram: { size: '', unit: '' },
      rom: { size: '', unit: '' },
      expandable: { size: '', unit: '' },
    },
    display: {
      screen: { size: '', unit: '' },
      resolution: '',
    },
    colors: [],
    camera: {
      front: { value: '', unit: 'MP' },
      rear: { value: '', unit: 'MP' },
    },
    battery: { size: '', unit: 'mAh' },
    processor: '',
    OS: '',
  },
  quantity: '',
  images: [],
  allColors: ['Black', 'Blue', 'Red', 'White', 'Grey'],
};

const Product = () => {
  const [profile, setProfile] = useState(() => flatten(initialState, { safe: true }));
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { title, description, price, discount, quantity, allColors } = profile;

  //redux
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    await getBrands()
      .then((res) => {
        console.log(res.data);
        setBrands(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const brandSelectHandle = (_, e) => {
    setProfile({ ...profile, brand: e.value });
    setProducts([]);
    brands.forEach((brand) => {
      if (brand._id === e.value) {
        setProducts(brand.products);
      }
    });
  };

  const productSelectHandle = (_, e) => {
    setProfile({
      ...profile,
      product: e.value,
    });
  };

  const changeHandle = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };
  const selectHandle = (_, e) => {
    let selected = [];
    Array.from(e).forEach((color) => {
      selected.push(color.value);
    });
    setProfile({
      ...profile,
      'specification.colors': selected,
    });
  };

  const submitHandle = (e) => {
    e.preventDefault();
    createProductProfile(unflatten(profile), user.idToken)
      .then((res) => {
        console.log(res);
        setMessage(`"${title}" was created`);
      })
      .catch((err) => {
        console.log(err);
        setMessage(`"${err.response.data.err}"`);
      });
  };

  return (
    <div className={classes.product}>
      <div>
        <Sidebar />
      </div>
      <div className={classes.workspace}>
        <div>
          <h1>Create Product Profile </h1>
        </div>
        <div className={classes.form}>
          <div className={classes.images}>
            <ImageUpload value={profile} setValue={setProfile} />
          </div>
          <form onSubmit={submitHandle}>
            {brands.length > 0 && (
              <div>
                <label>Brand</label>
                <Select defaultValue='Select' style={{ width: '120px' }} onChange={brandSelectHandle}>
                  <Option title='brand' key='select' value='Select'>
                    Select
                  </Option>
                  {brands.map((brand) => (
                    <Option title='brand' key={brand._id} value={brand._id}>
                      {brand.name}
                    </Option>
                  ))}
                </Select>
              </div>
            )}
            {products.length > 0 && (
              <div>
                <label>Product</label>
                <Select style={{ width: '240px' }} defaultValue='select' onChange={productSelectHandle}>
                  <Option title='product' key='select' value='Select'>
                    Select
                  </Option>
                  {products.map((c) => (
                    <Option title='product' key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </div>
            )}
            <div>
              <label>Title</label>
              <Input type='text' name='title' value={title} error={error} change={changeHandle} />
            </div>
            <div>
              <label>Description</label>
              <Input type='text' name='description' value={description} error={error} change={changeHandle} />
            </div>
            <div>
              <label>Price</label>
              <Input type='text' name='price' value={price} error={error} change={changeHandle} />
            </div>
            <div>
              <label>Discount</label>
              <Input type='number' name='discount' value={discount} error={error} change={changeHandle} />
            </div>
            <div>
              <label>
                <b>Specification :</b>
              </label>
            </div>
            <div>
              <label>SIM</label>
              <Radio.Group name='specification.SIM' value={profile['specification.SIM']} onChange={changeHandle}>
                <div style={{ display: 'inline-flex' }}>
                  <Radio value='SINGLE SIM'>SINGLE SIM</Radio>
                  <Radio value='DUAL SIM'>DUAL SIM</Radio>
                </div>
              </Radio.Group>
            </div>
            <div>
              <label>Network</label>
              <Radio.Group
                name='specification.network'
                value={profile['specification.network']}
                onChange={changeHandle}>
                <div style={{ display: 'inline-flex' }}>
                  <Radio value='2G'>2G</Radio>
                  <Radio value='3G'>3G</Radio>
                  <Radio value='4G'>4G</Radio>
                  <Radio value='5G'>5G</Radio>
                </div>
              </Radio.Group>
            </div>
            <div>
              <label>RAM :</label>
              <Input
                type='number'
                name='specification.memory.ram.size'
                value={profile['specification.memory.ram.size']}
                error={error}
                change={changeHandle}
              />
              <Radio.Group
                style={{ display: 'flex', flexDirection: 'row', width: 'fit-content' }}
                name='specification.memory.ram.unit'
                value={profile['specification.memory.ram.unit']}
                onChange={changeHandle}>
                <Radio value='MB'>MB</Radio>
                <Radio value='GB'>GB</Radio>
                <Radio value='TB'>TB</Radio>
              </Radio.Group>
            </div>
            <div>
              <label>ROM :</label>
              <Input
                type='number'
                name='specification.memory.rom.size'
                value={profile['specification.memory.rom.size']}
                error={error}
                change={changeHandle}
              />
              <Radio.Group
                style={{ display: 'flex', flexDirection: 'row', width: 'fit-content' }}
                name='specification.memory.rom.unit'
                value={profile['specification.memory.rom.unit']}
                onChange={changeHandle}>
                <Radio value='MB'>MB</Radio>
                <Radio value='GB'>GB</Radio>
                <Radio value='TB'>TB</Radio>
              </Radio.Group>
            </div>
            <div>
              <label>Expandable Upto :</label>
              <Input
                type='number'
                name='specification.memory.expandable.size'
                value={profile['specification.memory.expandable.size']}
                error={error}
                change={changeHandle}
              />
              <Radio.Group
                style={{ display: 'flex', flexDirection: 'row', width: 'fit-content' }}
                name='specification.memory.expandable.unit'
                value={profile['specification.memory.expandable.unit']}
                onChange={changeHandle}>
                <Radio value='MB'>MB</Radio>
                <Radio value='GB'>GB</Radio>
                <Radio value='TB'>TB</Radio>
              </Radio.Group>
            </div>
            <div>
              <label>Screen Size</label>
              <Input
                type='number'
                name='specification.display.screen.size'
                value={profile['specification.display.screen.size']}
                error={error}
                change={changeHandle}
              />
              <Radio.Group
                style={{ display: 'flex', flexDirection: 'row', width: 'fit-content' }}
                name='specification.display.screen.unit'
                value={profile['specification.display.screen.unit']}
                onChange={changeHandle}>
                <Radio value='cm'>cm</Radio>
                <Radio value='inch'>inch</Radio>
              </Radio.Group>
            </div>
            <div>
              <label>Resolution</label>
              <Input
                type='text'
                name='specification.display.resolution'
                value={profile['specification.display.resolution']}
                error={error}
                change={changeHandle}
              />
            </div>
            <div>
              <label>Front Camera</label>
              <Input
                type='number'
                name='specification.camera.front.value'
                value={profile['specification.camera.front.value']}
                error={error}
                change={changeHandle}
              />
            </div>
            <div>
              <label>Rear Camera</label>
              <Input
                type='number'
                name='specification.camera.rear.value'
                value={profile['specification.camera.rear.value']}
                error={error}
                change={changeHandle}
              />
            </div>
            <div>
              <label>Battery</label>
              <Input
                type='number'
                name='specification.battery.size'
                value={profile['specification.battery.size']}
                error={error}
                change={changeHandle}
              />
            </div>
            <div>
              <label>Processor</label>
              <Input
                type='text'
                name='specification.processor'
                value={profile['specification.processor']}
                error={error}
                change={changeHandle}
              />
            </div>
            <div>
              <label>OS</label>
              <Input
                type='text'
                name='specification.OS'
                value={profile['specification.OS']}
                error={error}
                change={changeHandle}
              />
            </div>
            <div>
              <label>Quantity</label>
              <Input type='number' name='quantity' value={quantity} error={error} change={changeHandle} />
            </div>
            <div>
              <label>Colors</label>
              <Select
                mode='multiple'
                defaultValue={profile['specification.colors']}
                style={{ width: 'auto', minWidth: '120px' }}
                onChange={selectHandle}>
                {allColors.map((c) => (
                  <Option title='specification.colors' key={c} value={c}>
                    {c}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <Button type='submit'>Save</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Product;
