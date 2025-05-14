import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './cropImage';
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, Slider } from '@mui/material';

interface AvatarCropModalProps {
    imageSrc: string;
    onClose: () => void;
    onCropComplete: (croppedBlob: Blob) => void;
}

export const AvatarCropModal: React.FC<AvatarCropModalProps> = ({ imageSrc, onClose, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropCompleteInternal = useCallback((_: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCrop = async () => {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        onCropComplete(croppedImage);
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Обрезка изображения</DialogTitle>
            <DialogContent>
                <div style={{ position: 'relative', width: '100%', height: 400 }}>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropCompleteInternal}
                    />
                </div>
                <Slider
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(_, value) => setZoom(value as number)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleCrop} variant="contained">Сохранить</Button>
            </DialogActions>
        </Dialog>
    );
};