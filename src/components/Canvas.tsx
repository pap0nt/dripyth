import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image, Transformer, Rect, Group, Text } from 'react-konva';
import { useDesignStore } from '../store';
import { KonvaEventObject } from 'konva/lib/Node';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 1000;

export const DESIGN_AREA = {
  x: CANVAS_WIDTH * 0.25,
  y: CANVAS_HEIGHT * 0.15,
  width: CANVAS_WIDTH * 0.5,
  height: CANVAS_HEIGHT * 0.7,
};

export function DesignCanvas() {
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const [tshirtImage, setTshirtImage] = useState<HTMLImageElement | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  
  const { 
    layers, 
    selectedId, 
    isBackView,
    selectedModel,
    updateLayer, 
    setSelectedId,
    undo
  } = useDesignStore();

  const currentLayers = isBackView ? layers.back : layers.front;

  useEffect(() => {
    const image = new window.Image();
    image.crossOrigin = 'anonymous';
    image.src = isBackView ? selectedModel.previews.back : selectedModel.previews.front;
    image.onload = () => setTshirtImage(image);
  }, [isBackView, selectedModel]);

  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const node = stageRef.current?.findOne(`#${selectedId}`);
      if (node) {
        transformerRef.current.nodes([node]);
      }
    }
  }, [selectedId]);

  // Clear selection when switching sides
  useEffect(() => {
    setSelectedId(null);
  }, [isBackView, setSelectedId]);

  // Add keyboard shortcut for undo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const stageBox = stageRef.current?.container().getBoundingClientRect();
    if (!stageBox) return;

    const x = e.clientX - stageBox.left;
    const y = e.clientY - stageBox.top;

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (data.type === 'text') {
        const newId = Date.now().toString();
        useDesignStore.getState().addLayer({
          id: newId,
          type: 'text',
          text: 'PYTH',
          fontSize: 24,
          fontFamily: 'Arial',
          fill: '#ffffff',
          x: Math.min(Math.max(x, DESIGN_AREA.x), DESIGN_AREA.x + DESIGN_AREA.width - 100),
          y: Math.min(Math.max(y, DESIGN_AREA.y), DESIGN_AREA.y + DESIGN_AREA.height - 30),
          width: 100,
          height: 30,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          zIndex: currentLayers.length,
          flipped: false,
        }, isBackView ? 'back' : 'front');
        setSelectedId(newId);
        return;
      }

      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = data.src;
      
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const width = 150;
        const height = width / aspectRatio;
        
        const dropX = Math.min(Math.max(x - width / 2, DESIGN_AREA.x), DESIGN_AREA.x + DESIGN_AREA.width - width);
        const dropY = Math.min(Math.max(y - height / 2, DESIGN_AREA.y), DESIGN_AREA.y + DESIGN_AREA.height - height);
        
        const newId = Date.now().toString();
        useDesignStore.getState().addLayer({
          id: newId,
          type: 'image',
          src: data.src,
          x: dropX,
          y: dropY,
          width,
          height,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          zIndex: currentLayers.length,
          flipped: false,
        }, isBackView ? 'back' : 'front');
        
        setSelectedId(newId);
      };
    } catch (error) {
      console.error('Error processing dropped item:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleTransform = (id: string) => {
    const node = transformerRef.current?.nodes()?.[0];
    if (!node) return;

    const scaleX = Math.abs(node.scaleX());
    updateLayer(id, {
      x: node.x(),
      y: node.y(),
      scaleX: scaleX,
      scaleY: Math.abs(node.scaleY()),
      rotation: node.rotation(),
    }, isBackView ? 'back' : 'front');
  };

  const handleSelect = (id: string | null) => {
    setSelectedId(id);
  };

  const handleTextDblClick = (e: KonvaEventObject<MouseEvent>, id: string) => {
    const textNode = e.target;
    const layer = currentLayers.find(l => l.id === id);
    if (!layer || layer.type !== 'text') return;

    const textPosition = textNode.getAbsolutePosition();
    const stageBox = stageRef.current.container().getBoundingClientRect();
    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };

    const input = document.createElement('input');
    input.value = layer.text || '';
    input.style.position = 'absolute';
    input.style.left = `${areaPosition.x}px`;
    input.style.top = `${areaPosition.y}px`;
    input.style.width = `${textNode.width() * textNode.scaleX()}px`;
    input.style.height = `${textNode.height() * textNode.scaleY()}px`;
    input.style.fontSize = `${layer.fontSize}px`;
    input.style.fontFamily = layer.fontFamily || 'Arial';
    input.style.border = 'none';
    input.style.padding = '0px';
    input.style.margin = '0px';
    input.style.background = 'none';
    input.style.color = layer.fill;
    input.style.outline = 'none';
    input.style.zIndex = '1000';

    document.body.appendChild(input);
    input.focus();
    input.select();

    input.addEventListener('blur', function() {
      updateLayer(id, { text: input.value }, isBackView ? 'back' : 'front');
      document.body.removeChild(input);
    });

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        input.blur();
      }
    });
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      handleSelect(null);
    }
  };

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center bg-black"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Stage
        ref={stageRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="shadow-[0_0_20px_rgba(184,41,227,0.3)]"
        onClick={handleStageClick}
      >
        <Layer>
          {tshirtImage && (
            <Image
              image={tshirtImage}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              listening={false}
            />
          )}

          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.rect(
                DESIGN_AREA.x,
                DESIGN_AREA.y,
                DESIGN_AREA.width,
                DESIGN_AREA.height
              );
              ctx.closePath();
            }}
          >
            {currentLayers.map((layer) => {
              if (layer.type === 'text') {
                return (
                  <Text
                    key={layer.id}
                    id={layer.id}
                    text={layer.text}
                    x={layer.x}
                    y={layer.y}
                    fontSize={layer.fontSize}
                    fontFamily={layer.fontFamily}
                    fill={layer.fill}
                    scaleX={layer.scaleX}
                    scaleY={layer.scaleY}
                    rotation={layer.rotation}
                    draggable
                    onClick={() => handleSelect(layer.id)}
                    onTap={() => handleSelect(layer.id)}
                    onDblClick={(e) => handleTextDblClick(e, layer.id)}
                    onDragStart={() => setIsTransforming(true)}
                    onDragEnd={(e) => {
                      updateLayer(layer.id, {
                        x: e.target.x(),
                        y: e.target.y(),
                      }, isBackView ? 'back' : 'front');
                      setIsTransforming(false);
                    }}
                    onTransformStart={() => setIsTransforming(true)}
                    onTransformEnd={() => {
                      handleTransform(layer.id);
                      setIsTransforming(false);
                    }}
                  />
                );
              }

              const imageObj = new window.Image();
              imageObj.crossOrigin = 'anonymous';
              imageObj.src = layer.src!;

              return (
                <Image
                  key={layer.id}
                  id={layer.id}
                  image={imageObj}
                  x={layer.x}
                  y={layer.y}
                  width={layer.width}
                  height={layer.height}
                  scaleX={layer.scaleX * (layer.flipped ? -1 : 1)}
                  scaleY={layer.scaleY}
                  rotation={layer.rotation}
                  draggable
                  onClick={() => handleSelect(layer.id)}
                  onTap={() => handleSelect(layer.id)}
                  onDragStart={() => setIsTransforming(true)}
                  onDragEnd={(e) => {
                    updateLayer(layer.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    }, isBackView ? 'back' : 'front');
                    setIsTransforming(false);
                  }}
                  onTransformStart={() => setIsTransforming(true)}
                  onTransformEnd={() => {
                    handleTransform(layer.id);
                    setIsTransforming(false);
                  }}
                />
              );
            })}
          </Group>

          {(selectedId || isTransforming) && (
            <Rect
              x={DESIGN_AREA.x}
              y={DESIGN_AREA.y}
              width={DESIGN_AREA.width}
              height={DESIGN_AREA.height}
              stroke="#b829e3"
              strokeWidth={1}
              dash={[3, 3]}
              listening={false}
            />
          )}

          {selectedId && (
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                const box = { ...newBox };
                if (box.width < 10 || box.height < 10) {
                  return oldBox;
                }
                return box;
              }}
              borderStroke="#b829e3"
              borderStrokeWidth={0.5}
              borderDash={[3, 3]}
              anchorFill="#ffffff"
              anchorStroke="#b829e3"
              anchorSize={10}
              anchorCornerRadius={4}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}