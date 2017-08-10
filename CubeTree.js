function newCubeProperties(cubePos, cubeW, cubeH, minCubeW, minCubeH) {
    return {
        w: cubeW, h: cubeH,
        minW: minCubeW, minH: minCubeH,

        pos: cubePos
    }
}

function newCubeTree(cubeProperties) {
    return {
        root: newCubeNode(undefined, cubeProperties),



    }

}

function newCubeNode(parent, cubeProperties) {
    var cube = {
        properties: cubeProperties,
        getW: function () {
            return this.properties.w;
        },
        getH: function () {
            return this.properties.h;
        },
        getMinW: function () {
            return this.properties.minW;
        },
        getMinH: function () {
            return this.properties.minH;
        },
        getPos: function () {
            return this.properties.pos;
        },

        parent: parent,
        getParent: function () {
            return parent;
        },

        hasChild: false,
        isHasChild: function (){
            return this.hasChild;
        },
        firstChild: undefined, secondChild: undefined, thirdChild: undefined, forthChild: undefined,
        splitCube: function () {
            var w2 = this.getW() / 2,
                h2 = this.getH() / 2,
                minW = this.getMinW(),
                minH = this.getMinH(),
                pos = this.getPos();

            if(w2 > minW && h2 / 2 > minH){
                this.firstChild = newCubeNode(this,
                    newCubeProperties(pos, w2, h2, minW, minH));
                this.secondChild = newCubeNode(this,
                    newCubeProperties(vector.pointPlus(pos, point(w2, 0)), w2, h2, minW, minH));
                this.thirdChild = newCubeNode(this,
                    newCubeProperties(vector.pointPlus(pos, point(0, h2)), w2, h2, minW, minH));
                this.forthChild = newCubeNode(this,
                    newCubeProperties(vector.pointPlus(pos, point(w2, h2)), w2, h2, minW, minH));
                this.hasChild = true;
            } else {
                this.hasChild = false;
            }
        },

        objects: [],
        putObject: function (object) {
            if(this.isHasChild()){

            } else {
                this.objects.push(object);
            }
        },

        isObjectInCube: function(object){
            var aPos = this.getPos(),
                bPos = object.getPosition();
            var a1x = aPos.x, a1y = aPos.y,
                a2x = a1x + this.w, a2y = a1y + this.h,
                b1x = bPos.x, b1y = bPos.y,
                b2x = b1x + object.w, b2y = b1y + object.h;
            return a1y < b2y || a2y > b1y
                || a2x < b1x || a1x > b2x;
        }

    };

    cube.splitCube();
    return cube;
}