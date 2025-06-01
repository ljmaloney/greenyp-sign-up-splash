
import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import Index from "@/pages/Index";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Index">
                <Index/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;
