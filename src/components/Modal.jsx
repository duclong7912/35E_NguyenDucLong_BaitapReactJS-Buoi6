import React, { Component } from 'react'
import '../assets/css/style.css';

export default class Modal extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
        values: {
            id: '',
            name: '',
            sdt: '',
            email: '',
        },
        errors: {
            id: '',
            name: '',
            sdt: '',
            email: '',
        },
        isClose: false,
        valid: false,
      }
      
    }

    isValid = () => {
        const {values, errors} = this.state;

        for (let key in errors) {
            if (errors[key] !== '' || values[key] == '') {
                return false;
            }
        }
        return true;
    }

    
    handleInputChange = (e) => {
        let {id, name, value} = e.target;
        let type = e.target.getAttribute('data-type');
        let newValues = this.state.values;
        newValues[id] = value;
        let newErrors = this.state.errors;
        let messError = '';
        if (value.trim() === '') {
            messError = name + ' không được bỏ trống'
        } else if(type === 'email') {
            let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!value.match(regexEmail)) {
                messError = name + " không hợp lệ"
            } else {
                messError = ''
            }
        } else if (type === 'text') {
            let regexText = "^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" + "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" + "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$";
            if (!value.match(regexText)) {
                messError = name + " không hợp lệ"
            } else {
                messError = ''
            }
        } else if (type === 'number') {
            let regexNumber = /^[0-9]+$/;
            if(!value.match(regexNumber)) {
                messError = name + " không hợp lệ"
            } else {
                messError = '';
            }
        }
        newErrors[id] = messError;

        this.setState({
            values: newValues,
            errors: newErrors,
        }, () => {
            this.setState({valid: this.isValid()})
        })

    }

    handleSubmitUser = (e) => {
        e.preventDefault();
        const isValid = this.isValid();
        if(!isValid){
            return;
        } else{ 
            this.props.isOpenModal(this.state.isClose)
            this.props.editUser(this.state.values);
            
        }
    }

    componentDidMount () {
        let {id, name, sdt, email} = this.props.currentUser
        this.setState({
            values: {id: id , name: name, sdt: sdt, email: email}
        })
    }

    isCloseModal = () => {
        this.props.isOpenModal(this.state.isClose)
    }
  render() {
    return (
        <div className="modal fade" id="myModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <button className="close" data-dismiss="modal" onClick={() => {this.isCloseModal()}}>×</button>
                            <form className="mt-5 modal-edit" onSubmit={this.handleSubmit}>
                                <h4 className="text-center mb-3" style={{fontWeight: 600}}>Cập nhật thông tin sinh viên</h4>
                                <div className="form row">
                                    <div className="col-6 mb-2 d-flex flex-column" style={{height: '90px'}}>
                                        <label htmlFor="id">Mã SV</label>
                                        <input type="number" id="id" name="Mã SV" onInput={this.handleInputChange} value={this.state.values.id} disabled/>
                                        {this.state.errors.id && <div className="text text-danger error">{this.state.errors.id}</div>}
                                    </div>
                                    <div className="col-6 mb-2 d-flex flex-column" style={{height: '90px'}}>
                                        <label htmlFor="name">Họ tên</label>
                                        <input data-type='text' type="text" id="name" name="Họ tên" onInput={this.handleInputChange} value={this.state.values.name}/>
                                        {this.state.errors.name ? <div className="text text-danger error">{this.state.errors.name}</div> : ''}
                                    </div>
                                    <div className="col-6 mb-2 d-flex flex-column" style={{height: '90px'}}>
                                        <label htmlFor="sdt">Số điện thoại</label>
                                        <input data-type='number' type="text" id="sdt" name="Số điện thoại"  onInput={this.handleInputChange} value={this.state.values.sdt}/>
                                        {this.state.errors.sdt && <div className="text text-danger error">{this.state.errors.sdt}</div>}
                                    </div>
                                    <div className="col-6 mb-2 d-flex flex-column" style={{height: '90px'}}>
                                        <label htmlFor="email">Email</label>
                                        <input data-type='email' type="email" id="email" name="Email" onInput={this.handleInputChange} value={this.state.values.email}/>
                                        {this.state.errors.email && <div className="text text-danger error">{this.state.errors.email}</div>}
                                    </div>
                                </div>

                                <button type="submit" className="btnSubmit d-flex mt-4" disabled={!this.state.valid} onClick={this.handleSubmitUser} data-dismiss="modal">Cập nhật sinh viên</button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
    )
  }
}
