import { useRef, useEffect, useState } from 'react';
import { useWasm } from '../hooks';
import styled from 'styled-components';
import { Button, IconButton } from '@material-ui/core';
import { CloudUpload, Clear } from '@material-ui/icons';

const FilterOptions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
`;
const FilterOption = styled.div`
  padding: 10px;
`;
const CanvasContainer = styled.div`
  width: 602px;
  height: 602px;
  background-color: #f1f1f1;
  border: 1px solid #acacac;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding: 0 10px 10px 10px;
  border: 1px solid #e7e7e7;
`;
const Form = styled.form`
  display: flex;
  flex: 1;
`;

function ImageFilter() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBuffer, setImageBuffer] = useState<any>([]);
  const [defaultImageBuffer, setDefaultImageBuffer] = useState<any>([]);
  const [image, setImage] = useState<any>(null);
  const { loading, loaded, asModule, error } = useWasm('main-wasm.wasm');

  var canvasRef = useRef<HTMLCanvasElement>(null);
  var fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        setImage(img);
      };

      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  useEffect(() => {
    if (image) {
      drawImage(image);
    }
  }, [image]);

  useEffect(() => {
    if (imageBuffer && canvasRef.current) {
      var filteredImgData = new ImageData(
        canvasRef.current.width,
        canvasRef.current.height
      );
      filteredImgData.data.set(new Uint8ClampedArray(imageBuffer));
      canvasRef.current.getContext('2d')?.putImageData(filteredImgData, 0, 0);
    }
  }, [imageBuffer]);

  const drawImage = (image: HTMLImageElement) => {
    if (canvasRef.current) {
      const canvasCtx = canvasRef.current.getContext('2d')!;

      const scale = Math.max(
        canvasRef.current.width / image.width,
        canvasRef.current.height / image.height
      );
      const x = canvasRef.current.width / 2 - (image.width / 2) * scale;
      const y = canvasRef.current.height / 2 - (image.height / 2) * scale;

      canvasCtx.drawImage(
        image,
        x,
        y,
        image.width * scale,
        image.height * scale
      );

      const defaultImageData = canvasCtx.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      )!;
      setDefaultImageBuffer(defaultImageData.data);
    }
  };

  const filter = (method: string, ...fnArgs: any) => {
    var canvasImageData = canvasRef?.current
      ?.getContext('2d')
      ?.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)!;

    if (asModule) {
      //@ts-ignore
      const mem = new Uint8Array(asModule.importObject.env.memory.buffer);

      if (canvasImageData.data) {
        mem.set(canvasImageData.data);
      }
      const byteSize = canvasImageData.data.length;
      //@ts-ignore
      asModule.exports[method](byteSize, ...fnArgs);
      //@ts-ignore
      const filteredImgBuffer = asModule.importObject.env.memory?.buffer.slice(
        byteSize,
        2 * byteSize
      );

      setImageBuffer(filteredImgBuffer);
    }
  };

  return (
    <div className="image-filters">
      <Header>
        <FilterOptions>
          <FilterOption>
            <Button color="primary" onClick={() => filter('sepia')}>
              Sepia
            </Button>
          </FilterOption>
          <FilterOption>
            <Button color="primary" onClick={() => filter('invert')}>
              Invert
            </Button>
          </FilterOption>
          <FilterOption>
            <Button color="primary" onClick={() => filter('grayscale')}>
              Grayscale
            </Button>
          </FilterOption>
          <FilterOption>
            <Button
              color="primary"
              onClick={() =>
                filter('convolve', 600, offset.blur, ...matrices.blur)
              }
            >
              BLur
            </Button>
          </FilterOption>
          <FilterOption>
            <Button
              color="primary"
              onClick={() =>
                filter(
                  'convolve',
                  600,
                  offset.edge_detect,
                  ...matrices.edge_detect
                )
              }
            >
              Edge Detect
            </Button>
          </FilterOption>
          <FilterOption>
            <Button
              color="primary"
              onClick={() =>
                filter('convolve', 600, offset.emboss, ...matrices.emboss)
              }
            >
              Emboss
            </Button>
          </FilterOption>
          <FilterOption>
            <Button
              color="primary"
              variant="contained"
              onClick={() => setImageBuffer(defaultImageBuffer)}
            >
              Reset
            </Button>
          </FilterOption>
        </FilterOptions>
      </Header>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px 0',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <CanvasContainer>
          <canvas ref={canvasRef} width="600px" height="600px"></canvas>
        </CanvasContainer>
        <Form>
          <IconButton
            size="medium"
            onClick={(event) => {
              event.preventDefault();
              if (fileInputRef.current) fileInputRef.current.click();
            }}
          >
            <CloudUpload fontSize="inherit" />
          </IconButton>
          <input
            ref={fileInputRef}
            accept="image/*"
            onChange={(event) => {
              const file =
                event && event.target && event.target.files
                  ? event.target.files[0]
                  : null;
              if (file && file.type.substr(0, 5) === 'image') {
                setImageFile(file);
              } else {
                setImageFile(null);
              }
            }}
            type="file"
            style={{ display: 'none' }}
          />
        </Form>
      </div>
    </div>
  );
}

export default ImageFilter;

const offset = {
  sharpen1: 0,
  sharpen2: 0,
  blur: 0,
  emboss: 127,
  emboss_subtle: 0,
  edge_detect: 0,
  edge_detect_2: 0,
};

const matrices = {
  sharpen1: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
  sharpen2: [0, -2, 0, -2, 11, -2, 0, -2, 0],
  blur: [1, 2, 1, 2, 4, 2, 1, 2, 1],
  emboss: [2, 0, 0, 0, -1, 0, 0, 0, -1],
  emboss_subtle: [1, 1, -1, 1, 3, -1, 1, -1, -1],
  edge_detect: [1, 1, 1, 1, -7, 1, 1, 1, 1],
  edge_detect_2: [-5, 0, 0, 0, 0, 0, 0, 0, 5],
};
