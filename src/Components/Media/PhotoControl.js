import React from 'react';
import PropTypes from 'prop-types';
import './PhotoControl.css';
import ChatStore from "../../Stores/ChatStore";
import {getSize, getFitSize} from '../../Utils/Common';
import {PHOTO_SIZE, PHOTO_DISPLAY_SIZE} from "../../Constants";

class PhotoControl extends React.Component {
    constructor(props){
        super(props);

        this.onPhotoUpdated = this.onPhotoUpdated.bind(this);
    }

    /*shouldComponentUpdate(nextProps, nextState){
        if (nextProps.chat !== this.props.chat){
            return true;
        }

        return false;
    }*/

    componentWillMount(){
        ChatStore.on("message_photo_changed", this.onPhotoUpdated)
    }

    onPhotoUpdated(payload) {
        if (this.props.message && this.props.message.id === payload.messageId){
            this.forceUpdate();
        }
    }

    componentWillUnmount(){
        ChatStore.removeListener("message_photo_changed", this.onPhotoUpdated);
    }

    render() {
        let size = getSize(this.props.message.content.photo.sizes, PHOTO_SIZE);
        if (!size) return null;

        let fitSize = getFitSize(size, PHOTO_DISPLAY_SIZE);
        if (!fitSize) return null;

        let className = 'photo-img';
        let src = '';
        try{
            src = size.blob ? URL.createObjectURL(size.blob) : '';
        }
        catch(error){
            console.log(`PhotoControl.render photo with error ${error}`);
        }

        if (!size.blob && this.props.message.content.photo.sizes.length > 0)
        {
            let previewSize = this.props.message.content.photo.sizes[0];
            if (previewSize && previewSize.blob){
                className += ' photo-img-blur';
                try{
                    src = previewSize.blob ? URL.createObjectURL(previewSize.blob) : '';
                }
                catch(error){
                    console.log(`PhotoControl.render photo with error ${error}`);
                }
            }
        }

        return (
                <div className='photo-img-wrapper' style={{width: fitSize.width, height: fitSize.height}}>
                    <img className={className} width={fitSize.width} height={fitSize.height} src={src} alt=''/>
                </div>
            );
    }
}

PhotoControl.propTypes = {
    message : PropTypes.object.isRequired,
    openMedia : PropTypes.func.isRequired
};

export default PhotoControl;